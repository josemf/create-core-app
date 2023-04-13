// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { type } from '@josemf/core-types';
  
export default function loadModels() {

    type({
        name: type(String).display(),
        email: type(String("email")).required().unique(),

        password: type(String("password"))
            .description("Password must be minimum 8 characters and include alphanumeric digits")
            .adminField("readonly"),

        createdAt: type(Date).display("list"),
        updatedAt: type(Date)
    })
        .name("User")
        .relational()
        .admin()
        .restful();

    type({
        name: type(String).required()
    })
        .name("Pet")
        .relational()
        .admin()
        .restful();    
}
