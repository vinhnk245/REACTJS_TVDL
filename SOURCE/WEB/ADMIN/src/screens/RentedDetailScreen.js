import React, { Component } from 'react'
import { Row, Col, FormControl, Button, Modal } from 'react-bootstrap'
import '@styles/hover.css'
import {
    STRING,
    NUMBER,
    IS_ACTIVE,
    CONFIG,
    ROLE,
    STATUS,
    LIST_STATUS,
    LIST_DOB_MONTH,
    LIST_ORDER_BY_READER,
} from '@constants/Constant'
import { validateForm } from '@src/utils/helper'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import DatePickerCustom from '@src/components/DatePickerCustom'
import LoadingAction from '@src/components/LoadingAction'
import { notifyFail, notifySuccess } from '@src/utils/notify'
import swal from 'sweetalert'
import reactotron from 'reactotron-react-js'

class RentedDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            memberId: '',
            account: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            page: 1,
            limit: CONFIG.LIMIT,
            text: '',
            status: '',
            orderBy: '',
            cardNumber: '',
            totalCount: '',
            modalTitle: '',
            show: false,
            confirmModal: false,
            loadingAction: false,
            listStatus: LIST_STATUS,
            listDobMonth: LIST_DOB_MONTH,
            listOrderByMember: LIST_ORDER_BY_READER,
            modal: {
                [STRING.name]: '',
                [STRING.parentName]: '',
                [STRING.cardNumber]: '',
                [STRING.parentPhone]: '',
                [STRING.address]: '',
                [STRING.date_of_birth]: '',
                [STRING.note]: '',
            },
            validateError: {
                account: '',
                name: '',
                phone: '',
                address: '',
            },
            isEditReader: false,
            id: '',
            error: null,
            //
            listBookHis: [],
            totalCount: '',
        }
    }

    render() {
        return (<div>
            <h2>heleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeelo</h2>
        </div>)
    }

}



export default RentedDetailScreen