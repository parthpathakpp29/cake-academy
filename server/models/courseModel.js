import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Lecture title is required"],
    },
    videoUrl: {
        type: String,
        required: [true, "Lecture video is required"],
    },
    videoPublicId: String,
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
        publicId: String,
    },
    lectures: [lectureSchema],
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Course", courseSchema);
