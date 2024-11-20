import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Play, BookOpen, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'

// Lazy load the VideoPlayer component
const VideoPlayer = lazy(() => import('@/components/VideoPlayer'))

export default function VideoPlayerPage() {
  const { courseId, lectureIndex = '0' } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [currentLectureIndex, setCurrentLectureIndex] = useState(parseInt(lectureIndex))
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const videoContainerRef = useRef(null)

  const fetchCourse = useCallback(async () => {
    try {
      const response = await courseService.getCourseById(courseId)
      setCourse(response.course)
      
      if (user.role !== 1 && response.course.instructor !== user._id) {
        const enrollmentStatus = await courseService.checkEnrollment(courseId)
        if (!enrollmentStatus.isEnrolled) {
          toast.error("You are not enrolled in this course")
          navigate(`/courses/${courseId}`)
          return
        }
      }
    } catch (error) {
      toast.error('Failed to load course content')
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }, [courseId, navigate, user])

  useEffect(() => {
    fetchCourse()
  }, [fetchCourse])

  useEffect(() => {
    const preventRightClick = (e) => e.preventDefault()
    const preventKeyboardShortcuts = (e) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'j', 's', 'u', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', preventRightClick)
    document.addEventListener('keydown', preventKeyboardShortcuts)

    return () => {
      document.removeEventListener('contextmenu', preventRightClick)
      document.removeEventListener('keydown', preventKeyboardShortcuts)
    }
  }, [])

  useEffect(() => {
    const blurContent = () => {
      if (videoContainerRef.current) {
        videoContainerRef.current.style.filter = 'blur(20px)'
      }
    }

    const unblurContent = () => {
      if (videoContainerRef.current) {
        videoContainerRef.current.style.filter = 'none'
      }
    }

    window.addEventListener('blur', blurContent)
    window.addEventListener('focus', unblurContent)

    return () => {
      window.removeEventListener('blur', blurContent)
      window.removeEventListener('focus', unblurContent)
    }
  }, [])

  const handleNavigation = useCallback((direction) => {
    const newIndex = direction === 'next' ? currentLectureIndex + 1 : currentLectureIndex - 1
    if (newIndex >= 0 && newIndex < course.lectures.length) {
      setCurrentLectureIndex(newIndex)
      navigate(`/courses/${courseId}/lecture/${newIndex}`)
    }
  }, [currentLectureIndex, course, courseId, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary to-primary-dark">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    )
  }

  if (!course || !course.lectures[currentLectureIndex]) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Lecture Not Found</h2>
        <Button onClick={() => navigate('/courses')} className="mt-6">
          Back to Courses
        </Button>
      </div>
    )
  }

  const currentLecture = course.lectures[currentLectureIndex]
  const progress = ((currentLectureIndex + 1) / course.lectures.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div ref={videoContainerRef} className="rounded-lg overflow-hidden shadow-lg relative">
              <Suspense fallback={<div>Loading video player...</div>}>
                <VideoPlayer url={currentLecture.videoUrl} poster={course.thumbnail?.url} />
              </Suspense>
              <div className="absolute top-2 left-2 text-white text-sm bg-black bg-opacity-50 p-1 rounded">
                {user.name} - {user.email}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{currentLecture.title}</h2>
              <p className="text-gray-600 mb-6">{currentLecture.description}</p>

              <Separator className="my-6" />

              <div className="flex flex-wrap justify-between items-center gap-4">
                <Button onClick={() => handleNavigation('prev')} disabled={currentLectureIndex === 0} variant="outline" className="flex-1 sm:flex-none">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={() => handleNavigation('next')}
                  disabled={currentLectureIndex === course.lectures.length - 1}
                  className="flex-1 sm:flex-none"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
                {course.lectures.map((lecture, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentLectureIndex(index)
                      navigate(`/courses/${courseId}/lecture/${index}`)
                    }}
                    className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      currentLectureIndex === index
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    {lecture.completed ? (
                      <CheckCircle className={`h-5 w-5 ${currentLectureIndex === index ? 'text-primary-foreground' : 'text-green-500'}`} />
                    ) : (
                      <Play className={`h-5 w-5 ${currentLectureIndex === index ? 'text-primary-foreground' : 'text-primary'}`} />
                    )}
                    <span className="text-sm flex-1">{lecture.title}</span>
                    <span className="text-xs">{lecture.duration}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="mt-4 text-sm text-gray-600">
                You've completed {currentLectureIndex + 1} out of {course.lectures.length} lectures.
              </p>
              <Button className="w-full mt-4">
                <BookOpen className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}