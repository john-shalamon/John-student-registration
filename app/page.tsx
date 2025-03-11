"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { GalaxyBackground } from "@/components/galaxy-background"

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(16, { message: "Student must be at least 16 years old." }).max(100),
  email: z.string().email({ message: "Please enter a valid email address." }),
  course: z.string().min(1, { message: "Please select a course." }),
})


type Student = z.infer<typeof formSchema>

export default function StudentRegistration() {
  // State to store registered students
  const [students, setStudents] = useState<Student[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<Student>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0, // Use 0 instead of undefined to avoid controlled/uncontrolled warning
      email: "",
      course: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: Student) {
    setIsSubmitting(true)

    try {
      // Submit to Formspree
      const response = await fetch("https://formspree.io/f/xpwpaodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Add the new student to the list
        setStudents([...students, data])

        // Reset the form
        form.reset({
          name: "",
          age: 0,
          email: "",
          course: "",
        })

        // Show success message
        toast({
          title: "Student Registered",
          description: `${data.name} has been successfully registered for ${data.course}.`,
        })
      } else {
        throw new Error("Form submission failed")
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <GalaxyBackground />
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="backdrop-blur-sm bg-black/30 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-white">Student Registration</CardTitle>
              <CardDescription className="text-gray-300">
                Enter student details to register for a course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            className="bg-gray-900/60 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Age</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="18"
                            type="number"
                            className="bg-gray-900/60 border-gray-700 text-white"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value === "" ? "0" : e.target.value
                              field.onChange(Number.parseInt(value, 10))
                            }}
                            value={field.value === 0 ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@gmail.com"
                            {...field}
                            className="bg-gray-900/60 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Course</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-900/60 border-gray-700 text-white">
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-900 border-gray-700 text-white">
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          Select the course you want to register for.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register Student"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {students.length > 0 && (
            <Card className="backdrop-blur-sm bg-black/30 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-white">Registered Students</CardTitle>
                <CardDescription className="text-gray-300">List of all registered students.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-700 rounded-md divide-y divide-gray-700">
                  {students.map((student, index) => (
                    <div key={index} className="p-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-200">Name</p>
                          <p className="text-sm text-gray-400">{student.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">Age</p>
                          <p className="text-sm text-gray-400">{student.age}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">Email</p>
                          <p className="text-sm text-gray-400">{student.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">Course</p>
                          <p className="text-sm text-gray-400">
                            {student.course === "computer-science" && "Computer Science"}
                            {student.course === "mathematics" && "Mathematics"}
                            {student.course === "physics" && "Physics"}
                            {student.course === "chemistry" && "Chemistry"}
                            {student.course === "biology" && "Biology"}
                            {student.course === "engineering" && "Engineering"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

