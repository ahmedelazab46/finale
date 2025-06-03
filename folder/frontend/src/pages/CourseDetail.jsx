import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:8000';

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [ytApiReady, setYtApiReady] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);

  const token = localStorage.getItem('access');

  // Add debug logging
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, token, user });
  }, [isAuthenticated, token, user]);

  // Log slug
  useEffect(() => {
    console.log('Slug from URL:', slug);
  }, [slug]);

  // Log progress changes
  useEffect(() => {
    console.log('Course progress updated:', course?.progress, 'Active lesson:', course?.lessons?.[activeVideoIndex]?.id);
  }, [course?.progress, activeVideoIndex]);

  // Fetch course data
  const fetchCourse = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token && isAuthenticated) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Using auth headers:', headers);
      }

      const response = await axios.get(`${API_BASE_URL}/courses/course/${slug}/`, {
        headers
      });

      console.log('API response:', response.data);
      const sortedLessons = response.data.lessons.sort((a, b) => a.order - b.order);
      setCourse({ ...response.data, lessons: sortedLessons });
      setIsEnrolled(response.data.is_enrolled || false);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching course:', err);
      if (err.response?.status === 401) {
        // If token is invalid, clear it and update auth state
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        window.location.reload();
        return;
      }
      const errorMessage = err.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Make sure the server is running on http://127.0.0.1:8000'
        : err.response?.data?.detail || 'Failed to load course details';
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug, isAuthenticated]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) {
      setYtApiReady(true);
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API ready');
      setYtApiReady(true);
    };

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  // Initialize and update YouTube player
  useEffect(() => {
    if (!ytApiReady || !course?.lessons?.[activeVideoIndex]?.video_url || !isAuthenticated || !isEnrolled) {
      return;
    }

    const videoId = getYouTubeVideoId(course.lessons[activeVideoIndex].video_url);
    if (!videoId) {
      console.error('Invalid YouTube URL:', course.lessons[activeVideoIndex].video_url);
      setError('Invalid YouTube video URL');
      return;
    }

    if (!document.getElementById('youtube-player')) {
      console.error('YouTube player DOM element not found');
      setError('Failed to initialize video player');
      return;
    }

    console.log('Handling player for video:', videoId, 'Lesson ID:', course.lessons[activeVideoIndex].id);

    const loadVideo = () => {
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        console.log('Loading new video:', videoId);
        playerRef.current.loadVideoById(videoId);
      } else {
        console.log('Initializing YouTube player with video:', videoId);
        playerRef.current = new window.YT.Player('youtube-player', {
          height: '360',
          width: '100%',
          videoId,
          playerVars: { autoplay: 0, controls: 1 },
          events: {
            onReady: (event) => {
              console.log('YouTube player ready');
              event.target.playVideo();
            },
            onStateChange: (event) => {
              console.log('Player state changed:', event.data, 'Video:', videoId, 'Lesson:', course.lessons[activeVideoIndex].id);
              if (event.data === window.YT.PlayerState.ENDED) {
                console.log('Video ended, marking as completed...');
                markLessonCompleted();
              }
            },
            onError: (event) => {
              console.error('YouTube player error:', event.data);
              setError('Error playing video');
            },
          },
        });
      }
    };

    loadVideo();

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        console.log('Destroying YouTube player');
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [ytApiReady, activeVideoIndex, course, isAuthenticated, isEnrolled]);

  // Extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Enroll in course
  const enrollInCourse = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'You need to login to enroll in the course.',
        confirmButtonText: 'Go to Login',
      }).then(() => navigate('/login'));
      return;
    }

    if (!course?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Course ID not found. Please try again.',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/courses/student/enroll/`,
        { course_id: course.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setIsEnrolled(true);
      await fetchCourse();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text:
          response.data.message ||
          (course.courseType.toLowerCase() === 'paid'
            ? 'Payment successful! You are now enrolled in the course!'
            : 'Successfully enrolled in the course!'),
        confirmButtonText: 'OK',
      });
    } catch (err) {
      console.error('Error enrolling:', err.response?.data);
      const errorMessage =
        err.response?.status === 402
          ? 'Payment failed. Please try again.'
          : err.response?.data?.error || 'Failed to enroll in the course';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
      });
      setError(errorMessage);
    }
  };

  const handlePayPalSuccess = async (details) => {
    try {
      console.log('PayPal payment successful:', details);
      const response = await axios.post(
        `${API_BASE_URL}/courses/student/enroll/`,
        { 
          course_id: course.id,
          payment_id: details.id,
          payment_status: details.status,
          payment_amount: course.price,
          payment_currency: 'USD'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setIsEnrolled(true);
      await fetchCourse();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Payment successful! You are now enrolled in the course!',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      console.error('Error enrolling:', err);
      const errorMessage = err.response?.data?.error || 'Failed to enroll in the course';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
      });
    }
  };

  // Handle enroll button click
  const handleButtonClick = () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to enroll in this course',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    if (course.courseType.toLowerCase() === 'free') {
      enrollInCourse();
    } else {
      setShowPayPal(true);
    }
  };

  // Mark lesson as completed
  const markLessonCompleted = async () => {
    if (!course?.lessons || !course.lessons[activeVideoIndex]) {
      console.error('No lessons or current video not found');
      return;
    }

    const lessonId = course.lessons[activeVideoIndex].id;
    const courseId = course.id;
    console.log('Marking lesson completed:', { lessonId, courseId, activeVideoIndex });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/courses/student/mark-lesson-completed/`,
        {
          lesson_id: lessonId,
          course_id: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Mark lesson response:', response.data);

      await fetchCourse();

      Swal.fire({
        icon: 'success',
        title: 'Lesson Completed',
        text: 'Lesson completion has been recorded successfully!',
        timer: 1500,
        showConfirmButton: false,
      });

      if (response.data.next_video_id) {
        const nextIndex = course.lessons.findIndex(
          (lesson) => lesson.id === response.data.next_video_id
        );
        if (nextIndex !== -1) {
          setActiveVideoIndex(nextIndex);
          console.log('Navigating to next video, index:', nextIndex);
        } else {
          console.error('Next video not found');
          if (activeVideoIndex < course.lessons.length - 1) {
            setActiveVideoIndex((prev) => prev + 1);
            console.log('Advancing to next lesson, index:', activeVideoIndex + 1);
          }
        }
      } else if (activeVideoIndex < course.lessons.length - 1) {
        setActiveVideoIndex((prev) => prev + 1);
        console.log('Advancing to next lesson, index:', activeVideoIndex + 1);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Course Completed',
          text: 'This is the last video in the course!',
          confirmButtonText: 'OK',
        });
        if (response.data.course_status === 'Completed') {
          Swal.fire({
            icon: 'success',
            title: 'Congratulations!',
            text: 'You have successfully completed the course!',
            confirmButtonText: 'View Certificate',
          }).then(() => {
            navigate(`/certificate/${course.id}`);
          });
        }
      }
    } catch (err) {
      console.error('Error marking lesson completed:', err.response?.data || err);
      const errorMessage = err.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Make sure the server is running.'
        : err.response?.data?.error || 'Failed to record lesson completion';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
      });
      setError(errorMessage);
    }
  };

  // Navigate to next video manually
  const handleNextVideo = () => {
    if (activeVideoIndex >= course.lessons.length - 1) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: 'This is the last video in the course',
        confirmButtonText: 'OK',
      });
      return;
    }
    setActiveVideoIndex((prev) => prev + 1);
  };

  // Navigate to previous video
  const handlePreviousVideo = () => {
    setActiveVideoIndex((prev) => Math.max(0, prev - 1));
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Course not found</div>
      </div>
    );
  }

  const currentVideo = course.lessons[activeVideoIndex];
  const instructorName = course.instructor_name || 'Unknown Instructor';
  const isNextDisabled = activeVideoIndex === course.lessons.length - 1;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 bg-dark text-white"> {/* تغيير الخلفية إلى داكن مع نصوص بيضاء */}
              <h1 className="mb-3">{course.title}</h1>
              <p><strong>Slug:</strong> {course.slug || 'Not available'}</p>
              <p className="mb-4">{course.description}</p>
              <div className="d-flex gap-3 mb-4">
                <span className="badge bg-primary text-dark">{course.level}</span>
                <span className="badge bg-secondary text-dark">{course.category}</span>
                <span className="badge bg-info text-dark">{course.courseType}</span>
              </div>
              <div>
                <strong>Progress:</strong>{' '}
                {isAuthenticated && isEnrolled
                  ? `${course.progress?.toFixed(2) || 0}%`
                  : 'Not enrolled'}
                {isAuthenticated && isEnrolled && course.status === 'Completed' && (
                  <span className="badge bg-success text-dark ms-2">Completed</span>
                )}
              </div>
              {!isEnrolled && (
                <div>
                  <button
                    className={`btn mt-3 ${
                      course.courseType.toLowerCase() === 'paid' ? 'btn-success' : 'btn-primary'
                    }`}
                    onClick={handleButtonClick}
                  >
                    {isAuthenticated
                      ? course.courseType.toLowerCase() === 'paid'
                        ? 'Buy Now'
                        : 'Enroll in Course'
                      : 'Login to Enroll'}
                  </button>

                  {showPayPal && course.courseType.toLowerCase() === 'paid' && (
                    <div className="mt-3">
                      <PayPalScriptProvider options={{ 
                        "client-id": "AZFryhb2KmoVhgYycoWYl1HJj-PDmIE3H0HpTrK83-KfLMLKeGcvX89VTvLgM89V4clRYehUjBaUDt4D",
                        currency: "USD"
                      }}>
                        <PayPalButtons
                          style={{
                            layout: "horizontal",
                            color: "blue",
                            shape: "rect",
                            label: "pay"
                          }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: course.price.toString(),
                                    currency_code: "USD"
                                  },
                                  description: `Enrollment in ${course.title}`
                                }
                              ]
                            });
                          }}
                          onApprove={async (data, actions) => {
                            const details = await actions.order.capture();
                            await handlePayPalSuccess(details);
                          }}
                          onError={(err) => {
                            console.error('PayPal Error:', err);
                            Swal.fire({
                              icon: 'error',
                              title: 'Payment Failed',
                              text: 'There was an error processing your payment. Please try again.',
                              confirmButtonText: 'OK'
                            });
                          }}
                          onCancel={() => {
                            setShowPayPal(false);
                            Swal.fire({
                              icon: 'info',
                              title: 'Payment Cancelled',
                              text: 'You have cancelled the payment process.',
                              confirmButtonText: 'OK'
                            });
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4 bg-dark text-white"> {/* تغيير الخلفية إلى داكن مع نصوص بيضاء */}
              <h3 className="mb-4">
                {currentVideo
                  ? `Lesson ${activeVideoIndex + 1}: ${currentVideo.title || 'Untitled lesson'}`
                  : 'Course Video'}
                {isAuthenticated && isEnrolled && currentVideo?.is_completed && (
                  <span className="badge bg-success text-dark ms-2">Completed</span>
                )}
              </h3>
              <div className="course-video-wrapper mb-4">
                {isAuthenticated && isEnrolled && currentVideo?.video_url ? (
                  <div className="ratio ratio-16x9">
                    <div id="youtube-player"></div>
                  </div>
                ) : (
                  <div className="alert alert-info text-dark">
                    {isAuthenticated
                      ? 'You need to enroll in the course to view lessons.'
                      : 'Please login to view course lessons.'}
                    {!isAuthenticated && (
                      <button className="btn btn-link p-0 ms-2" onClick={() => navigate('/login')}>
                        Login Now
                      </button>
                    )}
                  </div>
                )}
              </div>
              {isAuthenticated && isEnrolled && (
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-light"
                    onClick={handlePreviousVideo}
                    disabled={activeVideoIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={handleNextVideo}
                    disabled={isNextDisabled}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 bg-dark text-white"> {/* تغيير الخلفية إلى داكن مع نصوص بيضاء */}
              <h4 className="mb-3">Course Details</h4>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Duration:</strong> {course.duration} hours
                </li>
                <li className="mb-2">
                  <strong>Price:</strong> ${course.price}
                </li>
                <li className="mb-2">
                  <strong>Instructor:</strong> {instructorName}
                </li>
              </ul>
              <h5 className="mt-4 mb-3">What You'll Learn</h5>
              <p className="text-white">{course.what_you_will_learn}</p>
              <h5 className="mt-4 mb-3">Requirements</h5>
              <p className="text-white">{course.requirements}</p>
              <h5 className="mt-4 mb-3">Lessons</h5>
              <ul className="list-group">
                {course.lessons.map((lesson, index) => (
                  <li
                    key={lesson.id}
                    className={`list-group-item ${
                      index === activeVideoIndex ? 'active bg-primary text-white' : 'bg-dark text-white'
                    }`}
                    onClick={() => {
                      if (isAuthenticated && isEnrolled) {
                        setActiveVideoIndex(index);
                      } else if (!isAuthenticated) {
                        Swal.fire({
                          icon: 'warning',
                          title: 'Login Required',
                          text: 'Please login to access this lesson',
                          confirmButtonText: 'Go to Login',
                        }).then(() => navigate('/login'));
                      } else {
                        Swal.fire({
                          icon: 'warning',
                          title: 'Enrollment Required',
                          text: 'You need to enroll in the course to access lessons',
                          confirmButtonText: 'OK',
                        });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {`Lesson ${index + 1}: ${lesson.title || 'Untitled lesson'} (${
                      lesson.formatted_duration || 'Not available'
                    })`}
                    {isAuthenticated && isEnrolled && lesson.is_completed && (
                      <span className="badge bg-success text-dark ms-2">Completed</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;