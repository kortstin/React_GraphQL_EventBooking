const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./merge')



module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })

        } catch (error) {
            throw err;
        }

    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({
                _id: args.eventId
            });
            const booking = new Booking({
                user: '601ef134cbfa637214d3318b',
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);

        } catch (error) {
            throw err;
        }

    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({
                _id: args.bookingId
            });
            return event;
        } catch (err) {
            throw err;
        }
    }
};