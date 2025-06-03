# Le Wagon Frontend Project

A modern web application built with React and Bootstrap 5, designed to showcase Le Wagon's coding bootcamp courses and provide a seamless learning experience for students.

## Features

- 🎨 Modern and responsive design using Bootstrap 5
- 📱 Mobile-first approach
- 🔍 Course search and filtering
- 👤 User authentication and profile management
- 📊 Student dashboard with progress tracking
- 📅 Course scheduling and events
- 🏆 Achievement system
- 🔗 Social media integration

## Tech Stack

- React 18
- React Router DOM
- Bootstrap 5
- React Icons
- Axios
- Socket.IO Client
- Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lewagon-frontend.git
   cd lewagon-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lewagon-frontend/
├── public/
│   ├── images/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── CourseDetailPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── styles/
│   │   └── main.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Le Wagon](https://www.lewagon.com/) for inspiration
- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [React Icons](https://react-icons.github.io/react-icons/) for the icons
