import React from 'react'

function Features() {
  return (
    <div className="features-page">
      <section className="py-5">
        <div className="container">
          <h1 className="text-center mb-5">Our Features</h1>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Web Development</h3>
                  <p className="card-text">
                    Learn HTML, CSS, JavaScript, Ruby on Rails, and more to build full-stack web applications.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Data Science</h3>
                  <p className="card-text">
                    Master Python, SQL, and data analysis tools to work with big data and machine learning.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">UX/UI Design</h3>
                  <p className="card-text">
                    Learn design principles, prototyping, and user research to create beautiful interfaces.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Mobile Development</h3>
                  <p className="card-text">
                    Build iOS and Android apps using React Native and modern mobile development tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features 