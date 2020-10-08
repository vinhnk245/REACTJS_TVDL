import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const range = (start, end) => {
  let array = []
  for (let i = start; i <= end; i++) {
    array.push(i)
  }
  return array
}

const getYear = (date) => {
  let current_date = new Date(date)
  let year = current_date.getFullYear()
  return year
}

const getMonth = (date) => {
  let current_date = new Date(date)
  let month = current_date.getMonth()
  return month
}

export default function DatePickerCustom(props) {
  const [startDate, setStartDate] = useState(new Date())
  const years = range(1970, getYear(new Date()) + 1, 1)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return (
    <div>
      <DatePicker
        dateFormat={props.dateFormat}
        className={props.className}
        placeholderText={props.placeholderText}
        selected={props.selected}
        maxDate={props.maxDate}
        minDate={props.minDate}
        renderCustomHeader={({ date, changeMonth, changeYear }) => (
          <div
            style={{
              margin: 10,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)}>
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        onChange={(date) => props.handleChange(props.placeholderText, date)}
      />
    </div>
  )
}
