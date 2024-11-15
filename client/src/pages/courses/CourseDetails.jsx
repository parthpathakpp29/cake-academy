import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from "sonner"
import { Loader2, Play, Phone, Mail, MapPin, Clock, Users, Award, BookOpen, ChevronLeft, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { courseService } from "@/services/api"

const CourseDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await courseService.getCourseById(id)
        setCourse(response.course)
      } catch (error) {
        toast.error("Failed to fetch course details")
        navigate('/courses')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourseDetails()
    }
  }, [id, navigate])

  const handleStartCourse = () => {
    if (course?._id) {
      navigate(`/courses/${course._id}/lecture/0`)
    } else {
      toast.error("Course not available")
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (!course) {
    return <NotFoundState />
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSection course={course} />
      <MainContent course={course} handleStartCourse={handleStartCourse} />
    </div>
  )
}

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-gray-600">Loading course details...</p>
    </div>
  </div>
)

const NotFoundState = () => {
  const navigate = useNavigate()
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <p className="text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/courses')} className="mt-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    </div>
  )
}

const HeroSection = ({ course }) => (
  <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb title={course.title} />
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="lg:flex-1">
          <div className="space-y-4">
            <CourseHeader course={course} />
            <CourseDescription description={course.description} />
            <CourseStats course={course} />
            <InstructorInfo instructor={course.instructor} />
          </div>
        </div>
      </div>
    </div>
  </div>
)

HeroSection.propTypes = {
  course: PropTypes.object.isRequired,
}

const Breadcrumb = ({ title }) => (
  <nav className="flex items-center text-sm mb-8" aria-label="Breadcrumb">
    <Link to="/" className="hover:underline transition-colors">Home</Link>
    <span className="mx-2">›</span>
    <Link to="/courses" className="hover:underline transition-colors">Courses</Link>
    <span className="mx-2">›</span>
    <span>{title}</span>
  </nav>
)

Breadcrumb.propTypes = {
  title: PropTypes.string.isRequired,
}

const CourseHeader = ({ course }) => (
  <>
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" className="bg-white text-primary">Featured</Badge>
      <Badge variant="outline" className="border-white text-white">
        {course.category || 'Online Course'}
      </Badge>
    </div>
    <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
  </>
)

CourseHeader.propTypes = {
  course: PropTypes.object.isRequired,
}

const CourseDescription = ({ description }) => (
  <p className="text-xl leading-relaxed opacity-90">{description}</p>
)

CourseDescription.propTypes = {
  description: PropTypes.string.isRequired,
}

const CourseStats = ({ course }) => (
  <div className="flex flex-wrap gap-6 pt-4">
    <StatItem icon={<Users className="h-5 w-5" />} text={`${course.enrolledStudents || '0'} students`} />
    <StatItem icon={<Award className="h-5 w-5" />} text="Certificate of completion" />
    <StatItem icon={<Star className="h-5 w-5 fill-current" />} text="4.8 (234 reviews)" />
  </div>
)

CourseStats.propTypes = {
  course: PropTypes.object.isRequired,
}

const StatItem = ({ icon, text }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span>{text}</span>
  </div>
)

StatItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
}

const InstructorInfo = ({ instructor }) => (
  instructor && (
    <div className="flex items-center gap-2 mt-4">
      <img
        src={instructor.avatar || '/placeholder.svg?height=40&width=40'}
        alt={instructor.name}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <p className="font-medium">{instructor.name}</p>
        <p className="text-sm opacity-80">{instructor.title || 'Course Instructor'}</p>
      </div>
    </div>
  )
)

InstructorInfo.propTypes = {
  instructor: PropTypes.object,
}

const MainContent = ({ course, handleStartCourse }) => (
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-12">
        <CourseOverview overview={course.overview} />
        <LearningObjectives objectives={course.learningObjectives} />
        <Curriculum lectures={course.lectures} />
      </div>
      <div className="lg:col-span-1">
        <CourseSidebar course={course} handleStartCourse={handleStartCourse} />
      </div>
    </div>
  </div>
)

MainContent.propTypes = {
  course: PropTypes.object.isRequired,
  handleStartCourse: PropTypes.func.isRequired,
}

const CourseOverview = ({ overview }) => (
  <section className="bg-white rounded-xl p-6 shadow-sm">
    <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
    <div className="prose max-w-none">
      <p>{overview || 'No overview available for this course.'}</p>
    </div>
  </section>
)

CourseOverview.propTypes = {
  overview: PropTypes.string,
}

const LearningObjectives = ({ objectives }) => (
  <section className="bg-white rounded-xl p-6 shadow-sm">
    <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {objectives?.map((objective, index) => (
        <li key={index} className="flex items-start">
          <BookOpen className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
          <span>{objective}</span>
        </li>
      )) || <li>Learning objectives not specified.</li>}
    </ul>
  </section>
)

LearningObjectives.propTypes = {
  objectives: PropTypes.arrayOf(PropTypes.string),
}

const Curriculum = ({ lectures }) => (
  <section className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Course Curriculum</h2>
        <p className="text-gray-600">Master the fundamentals through structured lessons</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-primary">{lectures?.length || 0}</div>
        <div className="text-sm text-gray-600">Total Lessons</div>
      </div>
    </div>

    <Accordion type="single" collapsible className="space-y-4">
      {lectures?.map((lecture, index) => (
        <AccordionItem 
          key={index} 
          value={`item-${index}`}
          className="border rounded-lg px-4"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Play className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Lesson {index + 1}: {lecture.title}</div>
                <div className="text-sm text-gray-500">
                  {lecture.duration ? `${lecture.duration} mins` : 'Duration not specified'}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="pl-12">
              <p className="text-gray-600">{lecture.description || 'No description available'}</p>
              <LectureResources resources={lecture.resources} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
)

Curriculum.propTypes = {
  lectures: PropTypes.arrayOf(PropTypes.object),
}

const LectureResources = ({ resources }) => (
  resources && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">Resources:</h4>
      <ul className="list-disc pl-4 space-y-1">
        {resources.map((resource, idx) => (
          <li key={idx} className="text-primary hover:underline">
            <a href={resource.url}>{resource.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
)

LectureResources.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.object),
}

const CourseSidebar = ({ course, handleStartCourse }) => (
  <Card className="sticky top-8">
    <CardContent className="p-6 space-y-6">
      <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
        <img
          src={course.thumbnail?.url || '/placeholder.svg?height=320&width=400'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold">${course.price || 0}</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {course.discountPercentage ? `${course.discountPercentage}% OFF` : 'Full Price'}
          </Badge>
        </div>
        <Progress value={33} className="w-full" />
        <p className="text-sm text-gray-600">
          <strong>33% complete</strong> - Resume your learning journey
        </p>
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleStartCourse}
        >
          Continue Learning
        </Button>
        <p className="text-center text-sm text-gray-500">
          30-day money-back guarantee
        </p>
      </div>

      <CourseFeatures lectures={course.lectures} totalDuration={course.totalDuration} />
      <HelpSection />
    </CardContent>
  </Card>
)

CourseSidebar.propTypes = {
  course: PropTypes.object.isRequired,
  handleStartCourse: PropTypes.func.isRequired,
}

const CourseFeatures = ({ lectures, totalDuration }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Course Features:</h3>
    <ul className="space-y-3">
      <FeatureItem icon={<Play className="h-5 w-5 mr-3 text-primary" />} text={`${lectures?.length || 0} Video lessons`} />
      <FeatureItem icon={<Clock className="h-5 w-5 mr-3 text-primary" />} text={`${totalDuration || 'N/A'} total hours`} />
      <FeatureItem icon={<Users className="h-5 w-5 mr-3 text-primary" />} text="Access on mobile and TV" />
      <FeatureItem icon={<Award className="h-5 w-5 mr-3 text-primary" />} text="Certificate of completion" />
    </ul>
  </div>
)

CourseFeatures.propTypes = {
  lectures: PropTypes.arrayOf(PropTypes.object),
  totalDuration: PropTypes.string,
}

const FeatureItem = ({ icon, text }) => (
  <li className="flex items-center text-gray-600">
    {icon}
    {text}
  </li>
)

FeatureItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
}

const HelpSection = () => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
    <div className="space-y-4">
      <ContactItem href="tel:+421914414257" icon={<Phone className="h-5 w-5 text-primary" />} text="(+421) 914 414 257" />
      <ContactItem href="mailto:support@domain.com" icon={<Mail className="h-5 w-5 text-primary" />} text="support@domain.com" />
      <ContactItem icon={<MapPin className="h-5 w-5 text-primary flex-shrink-0" />} text="JI. Sunset Road No 815, Kuta" />
    </div>
  </div>
)

const ContactItem = ({ href, icon, text }) => (
  href ? (
    <a href={href} className="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors">
      {icon}
      <span>{text}</span>
    </a>
  ) : (
    <div className="flex items-center space-x-3 text-gray-600">
      {icon}
      <span>{text}</span>
    </div>
  )
)

ContactItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
}

export default CourseDetails