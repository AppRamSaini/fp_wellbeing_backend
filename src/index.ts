import { config } from '@/config';
import app from './app';

app.listen(config.env.PORT, () => {
    console.log(`Server is running on port ${config.env.PORT}`);
});
