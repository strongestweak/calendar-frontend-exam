import React, {Component} from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {
  format,
  parse,
  startOfWeek,
  getDay,
  differenceInMinutes,
} from 'date-fns'
import {eo} from 'date-fns/locale'
import {Calendar, Views, dateFnsLocalizer} from 'react-big-calendar'
import {
  fetchEvents,
  addNewEvent,
  updateEvent,
  deleteEvent,
} from 'actions/events'
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
} from 'antd'

import './styles.less'

const locales = {
  'en-US': eo,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

class HomeComponent extends Component {

  form = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      events: [],
      visible: false,
      loading: false,
      modalTitle: 'Add New Event',
      modalType: 'add',
      selectedId: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.reload !== prevState.reload) {
      const events = nextProps.events.map(item => ({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      }))
      return {
        ...prevState,
        events,
        loading: false,
      }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    const [el] = document.getElementsByClassName('rbc-events-container')
    if (el) {
      const {children} = el
      const details = []
      for (let i = 0; i < children.length; i++) {
        const [height] = children[i].style['height'].split('%')
        const [top] = children[i].style['top'].split('%')
        details.push({
          height,
          top,
        })
      }
      const over = []
      details.map((item, index) => {
        const top = +item.top
        const height = +item.height + top
        let count = 0
        details.map((item2, index2) => {
          if (index !== index2) {
            const top2 = +item2.top
            const height2 = +item2.height + top2
            let logic = false
            if (top < top2) {
              logic = top <= height2 && top2 <= height
            } else {
              logic = top2 <= height && top <= height2
            }
            if (logic) count++
          }
        })
        over.push(count)
      })
      over.map((num, index) => {
        children[index].style.width = `${100 / (num + 1)}%`
      })
    }
  }

  async componentDidMount() {
    try {
      await this.props.fetchEvents()
    } catch (error) {
      console.log(error)
    }
  }

  handleOk = async () => {
    await this.form.current.validateFields()
    this.setState({
      loading: !this.state.loading,
    })
    await this.form.current.submit()
  }

  handleCancel = () => {
    this.form.current.resetFields()
    this.setState({
      visible: !this.state.visible,
    })
  }

  onFinish = async values => {
    try {
      if (this.state.modalType === 'add') {
        await this.props.addEvent({
          start: values.start.format('YYYY-MM-DD HH:mm:ss'),
          end: values.end.format('YYYY-MM-DD HH:mm:ss'),
          title: values.title,
        })
      } else {
        await this.props.updateEvent({
          id: this.state.selectedId,
          start: values.start.format('YYYY-MM-DD HH:mm:ss'),
          end: values.end.format('YYYY-MM-DD HH:mm:ss'),
          title: values.title,
        })
      }

      this.setState({
        visible: !this.state.visible,
      })
      this.form.current.resetFields()
    } catch (error) {
      console.log(error)
    }
  }

  handleSelectEvent = event => {
    this.setState({
      visible: !this.state.visible,
      modalTitle: 'Update Event',
      modalType: 'edit',
      selectedId: event.id,
    })
    setTimeout(() => this.form.current.setFieldsValue({
      title: event.title,
      start: moment(event.start, 'YYYY-MM-DD HH:mm:ss'),
      end: moment(event.end, 'YYYY-MM-DD HH:mm:ss'),
    }), 10)
  }

  handleSelect = async ({start, end}) => {
    this.setState({
      modalTitle: 'Add New Event',
      modalType: 'add',
      visible: !this.state.visible,
    })

    this.form.current.setFieldsValue({
      start: moment(start, 'YYYY-MM-DD HH:mm:ss'),
      end: moment(end, 'YYYY-MM-DD HH:mm:ss'),
    })
  }

  removeEvent = event => async () => {
    try {
      await this.props.deleteEvent({id: event.id})
    } catch (error) {
      console.log(error)
    }
  }

  downloadFile = async () => {
    const {events} = this.state
    const data = events.map(event => ({
      start: differenceInMinutes(event.start, new Date(new Date(event.start).setHours(8, 0, 0, 0))),
      duration: differenceInMinutes(event.end, event.start),
      title: event.title,
    }))
    const fileName = 'Events'
    const json = JSON.stringify(data, undefined, 2)
    const blob = new Blob([json], {type: 'application/json'})
    const href = await URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = fileName + ".json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  render() {
    const {
      events,
      visible,
      loading,
      modalTitle,
    } = this.state

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    }

    const EventComponent = (val) => {
      const {
        height,
        top,
        width,
        xOffset,
      } = val.style

      return (
        <div className="rbc-event test" style={{
          height: `${height}%`,
          top: `${top}%`,
          width: `${width}%`,
          left: `${xOffset}%`,
        }}>
          <div className="rbc-event-content">
            <div>
              {val.event.title}
            </div>
            <span onClick={this.removeEvent(val.event)} className="delete-icon">
              x
            </span>
          </div>
        </div>
      )
    }

    const ToolbarComponent = (val) => {
      return (
        <div className="header">
          <div>
            <Button type="primary" onClick={this.downloadFile}>
              Download events
            </Button>
          </div>
          <div>
            {val.label}
          </div>
        </div>
      )
    }

    const component = {
      eventWrapper: EventComponent,
      toolbar: ToolbarComponent,
    }

    const formats = {
      dayHeaderFormat: val => format(val, 'MM/dd/yyyy'),
    }

    return (
      <div className="home-wrapper">
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          min={new Date(new Date().setHours(8, 0, 0, 0))}
          max={new Date(new Date().setHours(17, 0, 0, 0))}
          defaultView={Views.DAY}
          views={['day']}
          onSelectEvent={this.handleSelectEvent}
          onSelectSlot={this.handleSelect}
          components={component}
          formats={formats}
        />
        <Modal
          title={modalTitle}
          visible={visible}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Submit
            </Button>,
          ]}
        >
          <Form
            {...formItemLayout}
            ref={this.form}
            name="register"
            scrollToFirstError
            onFinish={this.onFinish}
          >
            <Form.Item
              name="title"
              label="Event name"
              rules={[
                {required: true,
                  message: 'Please input event name!'},
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="start"
              label="Event start date"
              rules={[
                {required: true,
                  message: 'Please select event start date!'},
              ]}
            >
              <DatePicker
                showTime
              />
            </Form.Item>
            <Form.Item
              name="end"
              label="Event end date"
              rules={[
                {required: true,
                  message: 'Please select event end date!'},
              ]}
            >
              <DatePicker
                showTime
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    eventsReducer: {
      reload,
      events,
    },
  } = state
  return {
    events,
    reload,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchEvents: () => dispatch(fetchEvents()),
    addEvent: payload => dispatch(addNewEvent(payload)),
    updateEvent: payload => dispatch(updateEvent(payload)),
    deleteEvent: payload => dispatch(deleteEvent(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent)
