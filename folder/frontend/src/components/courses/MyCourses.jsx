import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://127.0.0.1:8000';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
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

      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Swal.fire(
        'Error!',
        'Failed to load courses',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
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

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access');
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

        // تحديث القائمة بعد الحذف
        setCourses(prev => prev.filter(course => course.id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
        Swal.fire(
          'Error!',
          error.response?.data?.message || 'An error occurred while deleting the course',
          'error'
        );
      }
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Courses</h2>
        <Button 
          variant="primary" 
          onClick={() => navigate('/instructor/add-course')}
        >
          Add New Course
        </Button>
      </div>

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Level</th>
                <th>Students</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.category}</td>
                  <td>{course.level}</td>
                  <td>{course.students_count || 0}</td>
                  <td>
                    {course.average_rating ? (
                      <ProgressBar 
                        now={course.average_rating * 20} 
                        label={`${course.average_rating}/5`} 
                      />
                    ) : 'No ratings'}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyCourses; 