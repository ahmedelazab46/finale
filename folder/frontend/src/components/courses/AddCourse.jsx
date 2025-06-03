import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videos, setVideos] = useState([]);
  
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

  const [videoData, setVideoData] = useState({
    lesson_name: '',
    video_url: ''
  });

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

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addVideo = () => {
    if (videoData.lesson_name && videoData.video_url) {
      setVideos(prev => [...prev, { ...videoData }]);
      setVideoData({ lesson_name: '', video_url: '' });
    }
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      const formData = new FormData();
      // Explicitly include only the required fields, excluding instructor
      const fieldsToInclude = [
        'title', 'description', 'price', 'duration', 'level', 
        'category', 'courseType', 'requirements', 'what_you_will_learn', 'courseImage'
      ];
      fieldsToInclude.forEach(key => {
        if (key === 'price') {
          formData.append(key, parseFloat(courseData[key]) || 0);
        } else if (key === 'duration') {
          formData.append(key, parseInt(courseData[key], 10) || 0);
        } else if (courseData[key] !== null) {
          formData.append(key, courseData[key]);
        }
      });

      videos.forEach((video, index) => {
        formData.append(`videos[${index}][lesson_name]`, video.lesson_name);
        formData.append(`videos[${index}][video_url]`, video.video_url);
      });

      const response = await axios.post(
        `${API_BASE_URL}/courses/instructor/add-course/`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setSuccess('The course has been added successfully!');
      setTimeout(() => {
        navigate('/instructor/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error adding course:', error.response?.data);
      const errorMessage =
        error.response?.data?.errors
          ? Object.values(error.response.data.errors).join(', ')
          : error.response?.data?.message || 'An error occurred while adding the course';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h2>Add New Course</h2>
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
                maxLength={200}
                placeholder="Enter course title"
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
                placeholder="Enter course description"
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
                min="0"
                step="0.01"
                placeholder="Enter course price"
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
                min="1"
                placeholder="Enter course duration in hours"
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
                required
              />
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
                placeholder="Enter course requirements"
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
                placeholder="Enter what students will learn"
              />
            </Form.Group>

            <Card className="mb-3">
              <Card.Header>
                <h4>Course Videos</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Lesson Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lesson_name"
                    value={videoData.lesson_name}
                    onChange={handleVideoChange}
                    maxLength={255}
                    placeholder="Enter lesson name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Video URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="video_url"
                    value={videoData.video_url}
                    onChange={handleVideoChange}
                    placeholder="https://example.com/video"
                  />
                </Form.Group>

                <Button 
                  variant="secondary" 
                  onClick={addVideo}
                  disabled={!videoData.lesson_name || !videoData.video_url}
                >
                  Add Video
                </Button>

                {videos.length > 0 && (
                  <ListGroup className="mt-3">
                    {videos.map((video, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{video.lesson_name}</strong>
                          <br />
                          <small>{video.video_url}</small>
                        </div>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => removeVideo(index)}
                        >
                          Remove
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Adding Course...' : 'Add Course'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddCourse;