import React from 'react'

function Pricing() {
  return (
    <div className="pricing-page">
      <section className="py-5">
        <div className="container">
          <h1 className="text-center mb-5">Pricing Plans</h1>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3 className="card-title">Web Development</h3>
                  <h4 className="card-subtitle mb-3">9 weeks</h4>
                  <p className="card-text">
                    Learn to build web applications from scratch
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li>Full-stack development</li>
                    <li>Project-based learning</li>
                    <li>Career support</li>
                  </ul>
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3 className="card-title">Data Science</h3>
                  <h4 className="card-subtitle mb-3">9 weeks</h4>
                  <p className="card-text">
                    Master data analysis and machine learning
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li>Python programming</li>
                    <li>Data visualization</li>
                    <li>Machine learning</li>
                  </ul>
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3 className="card-title">UX/UI Design</h3>
                  <h4 className="card-subtitle mb-3">9 weeks</h4>
                  <p className="card-text">
                    Create beautiful and functional interfaces
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li>Design principles</li>
                    <li>User research</li>
                    <li>Prototyping</li>
                  </ul>
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing 