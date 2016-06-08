node {
    stage 'Fetch source code'
    git url: 'https://github.com/instea/react-native-popup-menu.git', branch: 'master'
    stage 'Install dependencies'
    sh 'npm install'
    stage 'Run tests'
    try {
      sh 'npm test'
    } finally {
      step([$class: 'JUnitResultArchiver', testResults: 'target/*.xml'])
      step([$class: 'ArtifactArchiver', artifacts: 'coverage/**/*', fingerprint: true])
      step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: "${env.DEV_MAIL}", sendToIndividuals: true])
    }
}
