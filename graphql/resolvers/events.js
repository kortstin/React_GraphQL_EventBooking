const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');



module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '601ef134cbfa637214d3318b'
        });
        let createdEvent;
        try {
            const result = await event
                .save();
            createdEvent = transformEvent(result);
            const creator = await User.findById('601ef134cbfa637214d3318b');
            if (!creator) {
                throw new Error("User not found.");
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }

    },
    createUser: async args => {
        try {
            const user = await User.findOne({
                email: args.userInput.email
            });
            if (user) {
                throw new Error("User already exists.");
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user_1 = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user_1.save();
            return {
                ...result._doc,
                password: null,
                _id: result.id
            };
        } catch (err) {
            throw err;
        }

    }
};