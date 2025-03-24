const app = require('./src/app');
const appConfig = require('./src/configs/app.config');

const config = appConfig
const PORT = appConfig.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});