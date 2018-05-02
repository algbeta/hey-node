import * as config from './config';
import { User, Product } from './models';
import Importer from './dirwatch/importer';

console.log(config.name);

const user = new User();
const product = new Product();
const importer = new Importer();
