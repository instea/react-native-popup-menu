node {
    stage 'Fetch source code'
    git url: 'https://github.com/instea/react-native-popup-menu.git', branch: 'jenkins-pipeline'
    stage 'Install dependencies'
    sh 'npm install'
    stage 'Run tests'
    sh 'npm test || true'
    step([$class: 'JUnitResultArchiver', testResults: 'target/*.xml'])
    step([$class: 'ArtifactArchiver', artifacts: 'coverage/**/*', fingerprint: true])
}
