import { Asset } from './Asset';


export class UserData {
    id: string;
    name: string;
    email: string;
    age: number;
    assets: Asset[];
    categories: string[];
  
    constructor(id: string, name: string, email: string, age: number, assets: Asset[], categories: string[]) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.age = age;
      this.assets = assets;
      this.categories = categories;
    }
  }
  