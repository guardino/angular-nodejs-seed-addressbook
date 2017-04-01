export class User {
    private _user_id:        string;
    private _user_name:      string;
    private _email:          string;
    private _client_id:      string;
    private _exp:            string;
    private _scope:          string[];
    private _jti:            string;
    private _aud:            string[];
    private _sub:            string;
    private _iss:            string;
    private _iat:            string;
    private _cid:            string;
    private _grant_type:     string;
    private _azp:            string;
    private _auth_time:      string;
    private _zid:            string;
    private _rev_sig:        string;
    private _origin:         string;
    private _revocable:       boolean;

    constructor(user_id: string, user_name: string, email: string, client_id: string, exp: string, scope: string[], jti: string, aud: string[], sub: string, iss: string, iat: string, cid: string, grant_type: string, azp: string, auth_time: string, zid: string, rev_sig: string, origin: string, revocable: boolean) {
        this._user_id = user_id;
        this._user_name = user_name;
        this._email = email;
        this._client_id = client_id;
        this._exp = exp;
        this._scope = scope;
        this._jti = jti;
        this._aud = aud;
        this._sub = sub;
        this._iss = iss;
        this._iat = iat;
        this._cid = cid;
        this._grant_type = grant_type;
        this._azp = azp;
        this._auth_time = auth_time;
        this._zid = zid;
        this._rev_sig = rev_sig;
        this._origin = origin;
        this._revocable = revocable;
    }

    get user_id(): string {
        return this._user_id;
    }

    set user_id(value: string) {
        this._user_id = value;
    }

    get user_name(): string {
        return this._user_name;
    }

    set user_name(value: string) {
        this._user_name = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get client_id(): string {
        return this._client_id;
    }

    set client_id(value: string) {
        this._client_id = value;
    }

    get exp(): string {
        return this._exp;
    }

    set exp(value: string) {
        this._exp = value;
    }

    get scope(): string[] {
        return this._scope;
    }

    set scope(value: string[]) {
        this._scope = value;
    }

    get jti(): string {
        return this._jti;
    }

    set jti(value: string) {
        this._jti = value;
    }

    get aud(): string[] {
        return this._aud;
    }

    set aud(value: string[]) {
        this._aud = value;
    }

    get sub(): string {
        return this._sub;
    }

    set sub(value: string) {
        this._sub = value;
    }

    get iss(): string {
        return this._iss;
    }

    set iss(value: string) {
        this._iss = value;
    }

    get iat(): string {
        return this._iat;
    }

    set iat(value: string) {
        this._iat = value;
    }

    get cid(): string {
        return this._cid;
    }

    set cid(value: string) {
        this._cid = value;
    }

    get grant_type(): string {
        return this._grant_type;
    }

    set grant_type(value: string) {
        this._grant_type = value;
    }

    get azp(): string {
        return this._azp;
    }

    set azp(value: string) {
        this._azp = value;
    }

    get auth_time(): string {
        return this._auth_time;
    }

    set auth_time(value: string) {
        this._auth_time = value;
    }

    get zid(): string {
        return this._zid;
    }

    set zid(value: string) {
        this._zid = value;
    }

    get rev_sig(): string {
        return this._rev_sig;
    }

    set rev_sig(value: string) {
        this._rev_sig = value;
    }

    get origin(): string {
        return this._origin;
    }

    set origin(value: string) {
        this._origin = value;
    }

    get revocable(): boolean {
        return this._revocable;
    }

    set revocable(value: boolean) {
        this._revocable = value;
    }
}