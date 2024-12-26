import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Lecture title is required"],
        trim: true,
        minlength: [1, "Lecture title cannot be empty"]
    },
    videoUrl: {
        type: String,
        required: true
    },
    videoKey: {
        type: String,
        required: true
    }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Course description is required"],
    },
    price: {
        type: Number,
        required: [true, "Course price is required"],
        min: 0,
    },
    thumbnail: {
        url: String,
        key: String,
    },
    lectures: [lectureSchema],
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Course", courseSchema);