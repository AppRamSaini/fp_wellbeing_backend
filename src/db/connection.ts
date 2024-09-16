import mongoose from 'mongoose';
import { config } from '../config';

mongoose.connect(config.env.DATABASE_URL);

const database = mongoose.connection;

database.on('error', error => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
});

export default database;
