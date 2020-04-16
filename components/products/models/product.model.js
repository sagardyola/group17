const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    message: String,
    point: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})


const productSchema = new Schema({
    name: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    brand: String,
    description: String,
    price: Number,
    quantity: Number,
    color: String,
    origin: String,
    warrenty: {
        warrentyStatus: Boolean,
        warrentyPeriod: String
    },
    manuDate: Date,
    expiryDate: Date,
    weight: Number,
    modelNo: String,
    volume: String,
    image: String,
    tags: [String],
    discount: {
        discountedItem: Boolean,
        discountType: String, //percentage, value
        discount: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reviews: [reviewSchema]
}, {
    timestamps: true
})

module.exports = mongoose.model('product', productSchema);