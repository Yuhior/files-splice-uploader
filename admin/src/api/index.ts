
import * as auth from './auth'
import * as user from './user'
import * as system from './system'
import * as file from './file'

export default {
	...auth,
	...user,
	...system,
	...file
};
