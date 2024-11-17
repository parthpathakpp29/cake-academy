import React, { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, X, ImageIcon, Loader2 } from 'lucide-react'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { courseSchema } from "@/utils/validations"
import { courseService } from "@/services/api"

const ThumbnailUpload = ({ value, onChange }) => (
  <div
    className="border-2 border-dashed rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer"
    onClick={() => document.getElementById('thumbnail').click()}
  >
    {value ? (
      <div className="relative">
        <img
          src={URL.createObjectURL(value)}
          alt="Course thumbnail"
          className="w-full h-48 object-cover rounded-lg"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="absolute bottom-2 right-2"
          onClick={(e) => {
            e.stopPropagation()
            onChange(null)
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <ImageIcon className="h-12 w-12 mb-2" />
        <p className="text-sm">Click to upload course thumbnail</p>
        <p className="text-xs text-gray-400 mt-1">Recommended size: 1280x720px</p>
      </div>
    )}
    <input
      id="thumbnail"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) {
          onChange(file)
        }
      }}
    />
  </div>
)

const LectureField = ({ index, remove, control }) => (
  <div key={index} className="p-4 border rounded-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Lecture {index + 1}</h3>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => remove(index)}
        className="text-gray-500 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>

    <div className="space-y-4">
      <FormField
        control={control}
        name={`lectures.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lecture Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter lecture title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`lectures.${index}.video`}
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Video</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById(`video-${index}`).click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
                <input
                  id={`video-${index}`}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      onChange(file)
                    }
                  }}
                  {...field}
                />
                {value && (
                  <span className="text-sm text-gray-500">
                    {value.name}
                  </span>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
)

export default function CreateCourse() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      thumbnail: null,
      title: "",
      description: "",
      price: 0,
      lectures: [{ id: 1, title: "", video: null }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lectures",
  })

  const onSubmit = async (data) => {
    try {
      if (!data.thumbnail) {
        toast.error("Course thumbnail is required");
        return;
      }

      setIsSubmitting(true)
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('price', data.price.toString())

      if (data.thumbnail instanceof File) {
        formData.append('thumbnail', data.thumbnail)
      }

      data.lectures.forEach((lecture, index) => {
        if (lecture.video instanceof File) {
          formData.append('video', lecture.video)
          formData.append(`lectureTitles[]`, lecture.title)
        }
      })

      await courseService.createCourse(formData)
      toast.success("Course created successfully")
      navigate("/admin/courses")
    } catch (error) {
      console.error("Error creating course:", error)
      toast.error(error.message || "Failed to create course")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create a new course</h1>
        <Button
          type="submit"
          form="course-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>

      <Form {...form}>
        <form id="course-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="landing" className="space-y-6">
            <TabsList className="w-full border-b">
              <TabsTrigger value="landing" className="flex-1">Course Landing Page</TabsTrigger>
              <TabsTrigger value="curriculum" className="flex-1">Curriculum</TabsTrigger>
            </TabsList>

            <TabsContent value="landing">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="thumbnail"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Course Thumbnail</FormLabel>
                          <FormControl>
                            <ThumbnailUpload value={value} onChange={onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter course title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter course description"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter course price"
                              min="0"
                              step="0.01"
                              className="max-w-xs"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {fields.map((field, index) => (
                      <LectureField key={field.id} index={index} remove={remove} control={form.control} />
                    ))}

                    <Button
                      type="button"
                      onClick={() => append({ id: fields.length + 1, title: "", video: null })}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lecture
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}