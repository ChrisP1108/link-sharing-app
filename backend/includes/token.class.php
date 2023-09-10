<?php  

class Token {

    // Expiration time after current time in seconds

    private static $expiration_default = 86400;

    // Hash string algorithm for token signature

    private static function pre_hash_stringify($id, $role, $expiration = null) {

        // Split WEB_TOKEN_SECRET in two

        $secret_length = strlen($_ENV['WEB_TOKEN_SECRET']);

        $mid_point = $secret_length / 2;

        $first_half_secret = substr($_ENV['WEB_TOKEN_SECRET'], 0, $mid_point);
        $second_half_secret = substr($_ENV['WEB_TOKEN_SECRET'], $mid_point);   

        // Check for expiration and then encode string prior to hashing

        if (!$expiration) {
            throw new Exception("Expiration time required.");
        } else return $first_half_secret . base64_encode($id) . base64_encode($_SERVER['HTTP_USER_AGENT']) . $second_half_secret . base64_encode($role) . base64_encode($expiration);
    }

    public static function generate($id = null, $role = null, $expiration = null) {

        // User Parameters

        $user_id = strval($id) ?? null;
        $expiration = $expiration ?? time() + self::$expiration_default;
        $expiration_string = strval($expiration);

        if (!$user_id) {
            throw new Exception("User Id input required");
        }

        if (!$role) {
            throw new Exception("User role input required");
        }

        // Hashing Salt Rounds.

        $options = [
            'cost' => 10,
        ];  

        // Bcrypt Hashing

        $hash = password_hash(self::pre_hash_stringify($user_id, $role, $expiration_string), PASSWORD_BCRYPT, $options);

        // Compile Token

        $token = json_encode([
            'id' => $user_id,
            'expiration' => $expiration_string,
            'key' => $hash
        ]);

        return base64_encode($token);
    }

    public static function cookie_valid($cookie = null, $users = null, $role = null, $user_id_key = 'id') {

        if (!$cookie || !$role || !$users) {
            throw new Exception("Cookie, role, and user data required.");
        }

        $json_token = base64_decode($cookie) ?? 'no data';

        $decoded = json_decode($json_token, true);
        
        // Find user in database based upon id in token
        
        $decoded_id = $decoded['id'] ?? null;

        if (!$decoded_id) {
            return false;
        }
        
        $user = null;
        
        foreach($users as $u) {
            if (strval($u[$user_id_key]) === strval($decoded_id)) {
                $user = $u;
            }
        }

        // Check if user found.  Otherwise return false
        
        if ($user) {
            $expiration_time = strval($decoded['expiration']) ?? '0';

            // Check if token is expired

            if (intval($expiration_time) <= time()) {
                return false;
            }

            // Verify key

            $hashed_key = $decoded['key'];
            $check = password_verify(self::pre_hash_stringify($decoded_id, $role, $expiration_time), $hashed_key);
            
            return $check;
        
        } else return false;
    }

    public static function get_cookie_id($cookie) {

        $json_token = base64_decode($cookie) ?? 'no data';

        $decoded = json_decode($json_token, true);

        return $decoded['id'] ?? null;
    }

    public static function set_cookie($data = null) {
        if (!$data || !isset($data['name']) || !isset($data['value'])) {
            throw new Exception("Cookie name and value parameters required.");
        }
        setcookie($data['name'], $data['value'], $data['expiration'] ?? time() + self::$expiration_default, '/', '', $data['secure'] ?? false, $data['http_only'] ?? false);
    }

    public static function remove_cookie($name = null) {
        if (!$name) {
            throw new Exception("Cookie name parameter required.");
        }
        setcookie($name, '', time() - 300, '/');
    }

    public static function generate_set_cookie($data) {
        if (!$data || !isset($data['name']) || !isset($data['id']) || !isset($data['role'])) {
            throw new Exception("Id, cookie name, and role parameters required.");
        }
        $data['value'] = self::generate($data['id'], $data['role'], $data['expiration']);
        self::set_cookie($data);
    }
}