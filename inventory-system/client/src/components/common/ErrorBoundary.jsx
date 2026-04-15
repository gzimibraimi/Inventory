import { Component } from 'react'
 
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
 
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
 
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }
 
  render() {
    if (this.state.hasError) {
      return (
        <div className="page-content">
          <div className="empty-state-container">
            <div className="empty-state-box">
              <div className="empty-icon">⚠️</div>
              <h2>Diçka shkoi keq</h2>
              <p>Ndodhi një gabim i papritur. Ju lutemi rifreskoni faqen.</p>
              <button
                className="primary-btn-large"
                onClick={() => window.location.reload()}
                style={{ marginTop: '1rem' }}
              >
                Rifresko faqen
              </button>
            </div>
          </div>
        </div>
      )
    }
 
    return this.props.children
  }
}