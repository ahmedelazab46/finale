import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://127.0.0.1:8000';

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    level: 'Beginner',
    category: 'Programming',
    courseImage: null,
    requirements: '',
    what_you_will_learn: '',
    courseType: 'Paid'
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await axios.get(
          `${API_BASE_URL}/courses/instructor/courses/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        // البحث عن الكورس المطلوب في القائمة
        const course = response.data.find(c => c.id === parseInt(courseId));
        if (!course) {
          throw new Error('Course not found');
        }

        setCourseData({
          title: course.title,
          description: course.description,
          price: course.price,
          duration: course.duration,
          level: course.level,
          category: course.category,
          requirements: course.requirements,
          what_you_will_learn: course.what_you_will_learn,
          courseType: course.courseType,
          courseImage: null
        });
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('An error occurred while fetching course data');
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'courseImage') {
      setCourseData(prev => ({
        ...prev,
        courseImage: files[0]
      }));
    } else {
      setCourseData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No access token found');
      }

      const formData = new FormData();
      Object.keys(courseData).forEach(key => {
        if (courseData[key] !== null) {
          formData.append(key, courseData[key]);
        }
      });

      const response = await axios.put(
        `${API_BASE_URL}/courses/instructor/edit-course/${courseId}/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setSuccess('The course has been updated successfully!');
      setTimeout(() => {
        navigate('/instructor/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error updating course:', error);
      setError(error.response?.data?.message || 'An error occurred while updating the course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete the course',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No access token found');
      }

      await axios.delete(
        `${API_BASE_URL}/courses/instructor/delete-course/${courseId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      await Swal.fire(
        'Deleted!',
        'The course has been deleted successfully.',
        'success'
      );

      navigate('/instructor/dashboard');

    } catch (error) {
      console.error('Error deleting course:', error);
      Swal.fire(
        'Error!',
        error.response?.data?.message || 'An error occurred while deleting the course',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2>Edit Course</h2>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={loading}
          >
            Delete Course
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={courseData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (in hours)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={courseData.duration}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Level</Form.Label>
              <Form.Select
                name="level"
                value={courseData.level}
                onChange={handleChange}
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={courseData.category}
                onChange={handleChange}
                required
              >
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
                <option value="Data Science">Data Science</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Type</Form.Label>
              <Form.Select
                name="courseType"
                value={courseData.courseType}
                onChange={handleChange}
                required
              >
                <option value="Paid">Paid</option>
                <option value="Free">Free</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Image</Form.Label>
              <Form.Control
                type="file"
                name="courseImage"
                onChange={handleChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Leave this field empty if you don't want to change the image
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="requirements"
                value={courseData.requirements}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>What You Will Learn</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="what_you_will_learn"
                value={courseData.what_you_will_learn}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditCourse; 