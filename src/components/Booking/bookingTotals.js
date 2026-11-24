/**
 * Shared booking price math (single source of truth).
 * Used by the invoice PDF and the "Pay Now" dialog on Your Bookings.
 *
 * Rules (same as the original invoice card / payment page):
 *  - room charge per night = sum of the room type prices of all rooms
 *  - 2 adults per room are included; each extra adult costs 20000 / night
 *  - total = (room charge + extra adult charge) x nights
 *
 * @param {object} booking booking entity (checkIn, checkOut, totalAdults, ...)
 * @param {Array}  rooms   rooms attached to the booking
 */
export const EXTRA_ADULT_FEE_PER_NIGHT = 20000

export const computeBookingTotals = (booking, rooms = []) => {
  const roomList = Array.isArray(rooms) ? rooms : []

  const roomRates = roomList.map((room) => Number(room?.roomType?.price) || 0)
  const roomPerNight = roomRates.reduce((sum, price) => sum + price, 0)

  const adults = Number(booking?.totalAdults) || 0
  const includedAdults = roomList.length * 2
  const extraAdults = Math.max(adults - includedAdults, 0)
  const extraAdultPerNight = extraAdults * EXTRA_ADULT_FEE_PER_NIGHT

  const date1 = new Date(booking?.checkIn)
  const date2 = new Date(booking?.checkOut)
  const validDates = !Number.isNaN(date1.getTime()) && !Number.isNaN(date2.getTime())
  const nights = validDates
    ? Math.max(Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000)), 0)
    : 0

  const perNight = roomPerNight + extraAdultPerNight
  const total = perNight * nights

  return {
    roomCount: roomList.length,
    roomRates,
    roomPerNight,
    adults,
    includedAdults,
    extraAdults,
    extraAdultPerNight,
    nights,
    perNight,
    total,
  }
}
