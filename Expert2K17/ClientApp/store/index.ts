import * as Home from './Home';
import * as User from './User';
import * as Profile from './Profile';
import * as Panel from './Panel';
import * as Login from './Login';
import * as Register from './Register';
import * as SystemS from './System'
import * as SystemI from './TestInterfaces'
import * as AttributeS from './Attribute'
import * as combinedSystems from './combinedSystem';
import * as Test from './Test';


// The top-level state object
export interface ApplicationState {
    user: User.UserState;
	profile: Profile.ProfileState;
    panel: Panel.PanelState;
    home: Home.HomeState;
    login: Login.LoginState;
    register: Register.RegisterState;
    combinedSystem: combinedSystems.SystemCreateState;
    test: Test.TestStore;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
	user: User.reducer,
	profile: Profile.reducer,
    panel: Panel.reducer,
    home: Home.reducer,
    login: Login.reducer,
    register: Register.reducer,
    combinedSystem: combinedSystems.reducer,
    test: Test.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
