import '../components/App/App.css'
import App from '../components/App'
import Chart from 'chart.js'
// normalize css
import 'minireset.css/minireset.min.css'

Chart.defaults.global.elements.line.fill = false
Chart.defaults.global.elements.line.borderWidth = 2
Chart.defaults.global.elements.point.radius = 0

// This default export is required in a new `pages/_app.js` file.
export default App
