import { jsPDF } from 'jspdf'
import { computeBookingTotals } from './bookingTotals'

const TEAL = [41, 191, 194]
const BLUE = [37, 99, 235]
const GRAY = [107, 114, 128]
const LIGHT = [243, 244, 246]
const DARK = [31, 41, 55]

const ROW_H = 8

const money = (value) => `${Number(value || 0).toLocaleString('en-US')} MMK`

/**
 * Builds a booking invoice PDF (A4, text based) with jsPDF.
 * Mirrors the calculations from the old invoice card:
 *  - room sub total = sum of room type prices
 *  - extra adult charge = 20000 per adult beyond 2 included adults per room
 *  - total comes from the payment when it exists
 *
 * @param {object} booking booking entity (may include payment)
 * @param {Array}  rooms   rooms attached to the booking
 * @returns {jsPDF} the generated document
 */
export const createBookingInvoicePdf = (booking, rooms = []) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  const tableWidth = pageWidth - margin * 2
  const rightX = pageWidth - margin

  // ---------- calculations (shared with the Pay Now dialog) ----------
  const totals = computeBookingTotals(booking, rooms)
  const roomList = Array.isArray(rooms) ? rooms : []
  const noOFRoom = totals.roomCount
  const roomTypePrice = totals.roomPerNight
  const ratePerRoom = totals.roomRates.join(' + ')
  const priceforAdult = totals.extraAdultPerNight
  const nights = totals.nights
  const subTotal = totals.perNight

  const adults = totals.adults
  const children = Number(booking?.totalChildren) || 0

  const checkIn = booking?.checkIn ?? '-'
  const checkOut = booking?.checkOut ?? '-'
  const date2 = new Date(booking?.checkOut)
  const isExpired = !Number.isNaN(date2.getTime()) ? new Date() > date2 : false

  const payment = booking?.payment
  const invoiceNo = payment?.invoiceNo ?? `RO-000${booking?.id ?? ''}`

  // ---------- header ----------
  let y = 18
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(...TEAL)
  doc.text('Relaxation Oasis', margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text('relax.oasis@gmail.com', margin, y + 6)
  doc.text('09940700008', margin, y + 11)

  doc.setFontSize(10)
  doc.setTextColor(...DARK)
  doc.setFont('helvetica', 'bold')
  doc.text(String(invoiceNo), rightX, y, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text(`Date : ${booking?.createdAt ?? '-'}`, rightX, y + 6, { align: 'right' })
  doc.text(payment?.cardType ? String(payment.cardType) : 'Not paid yet', rightX, y + 11, { align: 'right' })
  doc.text(`Status : ${String(booking?.statuss ?? '-')}`, rightX, y + 16, { align: 'right' })
  if (isExpired) {
    doc.setTextColor(220, 38, 38)
    doc.text('Expired', rightX, y + 21, { align: 'right' })
  }

  y += 24
  doc.setDrawColor(...TEAL)
  doc.setLineWidth(0.8)
  doc.line(margin, y, rightX, y)
  y += 8

  // ---------- guest information + rooms ----------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...DARK)
  doc.text('Guest Information', margin, y)
  doc.text('Rooms', 118, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  const guestLines = [
    `Name   :  ${booking?.guestName ?? '-'}`,
    `Email   :  ${booking?.username ?? '-'}`,
    `NRC    :  ${booking?.nrc ?? '-'}`,
    `Phone  :  ${booking?.phone ?? '-'}`,
  ]
  guestLines.forEach((line, index) => doc.text(line, margin, y + index * 5))

  let roomY = y
  if (roomList.length === 0) {
    doc.text('No rooms assigned', 118, roomY)
    roomY += 5
  } else {
    roomList.forEach((room) => {
      const roomName = room?.name ?? `Room #${room?.id ?? '?'}`
      const typeName = room?.roomType?.name ?? ''
      doc.text(`${roomName} - ${typeName} (${money(room?.roomType?.price)} /night)`, 118, roomY)
      roomY += 5
    })
  }

  y += Math.max(guestLines.length * 5, roomList.length * 5 || 5) + 4
  doc.line(margin, y - 2, rightX, y - 2)
  y += 5

  // ---------- booking information table ----------
  const labelX = margin + 2
  const detailsX = 78
  const rateX = 118
  const subX = rightX - 2

  const drawRow = (cols, rowY, { bold = false, fill = null } = {}) => {
    if (fill) {
      doc.setFillColor(...fill)
      doc.rect(margin, rowY, tableWidth, ROW_H, 'F')
    }
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    doc.text(String(cols[0]), labelX, rowY + 5.5)
    doc.text(String(cols[1]), detailsX, rowY + 5.5)
    doc.text(String(cols[2]), rateX, rowY + 5.5)
    doc.text(String(cols[3]), subX, rowY + 5.5, { align: 'right' })
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.2)
    doc.line(margin, rowY + ROW_H, rightX, rowY + ROW_H)
  }

  // header row
  doc.setFillColor(...BLUE)
  doc.rect(margin, y, tableWidth, ROW_H, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text('Booking Information', labelX, y + 5.5)
  doc.text('Details', detailsX, y + 5.5)
  doc.text('Rate', rateX, y + 5.5)
  doc.text('Sub Total', subX, y + 5.5, { align: 'right' })
  y += ROW_H

  const rows = [
    ['Check-In', checkIn, '', ''],
    ['Check-Out', checkOut, '', ''],
    ['Number Of Room', noOFRoom, ratePerRoom || '-', money(roomTypePrice)],
    ['Total Adults', adults, '20000 /additional adult /night', money(priceforAdult)],
    ['Total Children', children, '-', money(0)],
    ['', '', 'Sub Total', money(subTotal)],
    ['Total Days', nights, 'Multiply with days', `x ${nights}`],
  ]

  rows.forEach((row, index) => {
    const isSubTotalRow = index === 5
    drawRow(row, y, { bold: isSubTotalRow, fill: index % 2 === 0 ? LIGHT : null })
    y += ROW_H
  })

  // total row
  drawRow(['', '', 'Total', payment ? money(payment.total) : 'Not paid yet'], y, {
    bold: true,
    fill: [224, 247, 248],
  })
  y += ROW_H + 6

  // ---------- special request ----------
  if (booking?.specialRequest) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...DARK)
    doc.text('Special Request:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    const lines = doc.splitTextToSize(String(booking.specialRequest), tableWidth)
    doc.text(lines, margin, y + 5)
    y += 5 + lines.length * 4.5
  }

  // ---------- footer ----------
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text('Thank you for choosing Relaxation Oasis!', pageWidth / 2, y + 8, { align: 'center' })

  return doc
}

/**
 * Generates the invoice PDF and shows it in a new browser tab.
 * Falls back to downloading the file when the popup was blocked.
 *
 * @param {object} booking
 * @param {Array}  rooms
 * @param {Window|null} previewWindow optional pre-opened tab (avoids popup blockers)
 */
export const openBookingInvoicePdf = (booking, rooms, previewWindow = null) => {
  const doc = createBookingInvoicePdf(booking, rooms)
  const invoiceNo = booking?.payment?.invoiceNo ?? `booking-${booking?.id ?? ''}`
  const blobUrl = doc.output('bloburl')

  if (previewWindow) {
    previewWindow.location.href = blobUrl
  } else {
    const opened = window.open(blobUrl, '_blank')
    if (!opened) {
      doc.save(`${invoiceNo}.pdf`)
    }
  }
  return doc
}
