import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseService } from '@/services/api'
import { Button } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'
import { ChevronLeft, ChevronRight, Play, BookOpen, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import VideoPlayer from '@/components/VideoPlayer'

export default function VideoPlayerPage() {
  const { courseId, lectureIndex = '0' } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [currentLectureIndex, setCurrentLectureIndex] = useState(parseInt(lectureIndex))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourseById(courseId)
        setCourse(response.course)
      } catch (error) {
        toast.error('Failed to load course content')
        navigate('/courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId, navigate])

  const currentLecture = course?.lectures[currentLectureIndex]

  const handlePreviousLecture = () => {
    if (currentLectureIndex > 0) {
      setCurrentLectureIndex((prev) => prev - 1)
      navigate(`/courses/${courseId}/lecture/${currentLectureIndex - 1}`)
    }
  }

  const handleNextLecture = () => {
    if (currentLectureIndex < course.lectures.length - 1) {
      setCurrentLectureIndex((prev) => prev + 1)
      navigate(`/courses/${courseId}/lecture/${currentLectureIndex + 1}`)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!course || !currentLecture) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Lecture Not Found</h2>
        <Button onClick={() => navigate('/courses')} className="mt-4">
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black">
        <div className="container mx-auto px-4">
          <div className="aspect-video">
            <VideoPlayer url={currentLecture.videoUrl} poster={course.thumbnail?.url} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold mb-2">{currentLecture.title}</h1>
              <p className="text-gray-600 mb-6">{currentLecture.description}</p>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button onClick={handlePreviousLecture} disabled={currentLectureIndex === 0} variant="outline" className="w-full sm:w-auto">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Lecture
                </Button>
                <Button
                  onClick={handleNextLecture}
                  disabled={currentLectureIndex === course.lectures.length - 1}
                  className="w-full sm:w-auto"
                >
                  Next Lecture
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                {course.lectures.map((lecture, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentLectureIndex(index)
                      navigate(`/courses/${courseId}/lecture/${index}`)
                    }}
                    className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      currentLectureIndex === index ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {lecture.completed ? (
                      <CheckCircle className={`h-5 w-5 ${currentLectureIndex === index ? 'text-white' : 'text-green-500'}`} />
                    ) : (
                      <Play className={`h-5 w-5 ${currentLectureIndex === index ? 'text-white' : 'text-primary'}`} />
                    )}
                    <span className="text-sm flex-1">{lecture.title}</span>
                    <span className="text-xs">{lecture.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}