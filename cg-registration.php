<?php
/**
 * Plugin Name: CG Registration
 * Description: A simple Registration plugin
 * Version: 1.0.0
 * Author: Cyril Gouv
 * Text Domain: cg-registration
 */
if ( !defined('ABSPATH') ) {
    echo 'Hey, what are you doing to do?';
    exit;
}


class CgRegistration {
    public function __construct() {
        // Add assets
        add_action( 'wp_enqueue_scripts', [$this, 'load_scripts'] );

        // Ajax
        add_action( 'wp_ajax_nopriv_cg_register', [$this, 'register'] );

        // Shortcode output
        add_shortcode( 'cg-register', [$this, 'output'] );
    }

    public function load_scripts() {
        // CSS
        wp_enqueue_style( 'cg-registration-style', plugin_dir_url( __FILE__ ) . '/css/cg-registration.css' );
        // JS
        wp_enqueue_script( 'jQuery', '//code.jquery.com/jquery-3.6.0.min.js' );
        wp_enqueue_script( 'cg-registration-script', plugin_dir_url( __FILE__ ) . '/js/cg-registration.js', [], 1, true );
    }

    public function register() {
        check_ajax_referer( 'ajax-register-nonce', 'cg_auth' );
        
        $username = sanitize_user($_POST['username']);
        $email = sanitize_email($_POST['email']);
        $password = sanitize_text_field($_POST['password']);
        $password2 = sanitize_text_field($_POST['password2']);


        // Username Checking
        if ( username_exists( $username ) ) {

            echo json_encode([
                'status' => false,
                'field' => 'username',
                'message' => 'Ce pseudo existe déjà'
            ]);

            die();
        }

        if ( !validate_username( $username ) ) {

            echo json_encode([
                'status' => false,
                'field' => 'username',
                'message' => 'Ce pseudo n\'est pas un pseudo valide'
            ]);

            die();
        }

        if ( $username == '' ) {

            echo json_encode([
                'status' => false,
                'field' => 'username',
                'message' => 'Le pseudo est requis'
            ]);

            die();
        }

        if ( strlen( $username ) < 2 ) {

            echo json_encode([
                'status' => false,
                'field' => 'username',
                'message' => 'Le pseudo doit contenir au moins 2 caractères'
            ]);

            die();
        }


        // Email Checking
        if (!is_email($email)) {

            echo json_encode([
                'status' => false,
                'field' => 'email',
                'message' => 'Cet email n\'est pas un email valide'
            ]);

            die();
        }

        if ( email_exists($email) ) {

            echo json_encode([
                'status' => false,
                'field' => 'email',
                'message' => 'Cet email existe déjà'
            ]);

            die();
        }


        // Passwords Checking
        if ( $password == '' ) {

            echo json_encode([
                'status' => false,
                'field' => 'password',
                'message' => 'Un mot de passe est requis'
            ]);

            die();
        }

        if ( $password != $password2 ) {

            echo json_encode([
                'status' => false,
                'field' => 'passwordConfirm',
                'message' => 'Le mot de passe de confirmation ne corespond pas à celui du dessus'
            ]);

            die();
        }


        // SUCCESS
        $new_user = wp_insert_user([
            'user_login' => $username,
            'user_email' => $email,
            'user_pass' => $password,
            'user_registered' => date('Y-m-d H:i:s'),
            'role' => 'subscriber'
        ]);

        if ( $new_user ) {
            echo json_encode([
                'status' => true,
                'field' => 'success',
                'message' => 'Merci de votre enregistrement'
            ]);
    
            die();
        }
        
    }

    public function output() {
        ?>
        <form id="cg-register" data-url="<?= admin_url( 'admin-ajax.php' ) ?>">
            <div class="form-control">
                <input type="text" name="username" class="cg-register__username" data-input="Pseudo" placeholder="Pseudo">
                <small>Error Message</small>
            </div>

            <div class="form-control">
                <input type="text" name="email" class="cg-register__email" data-input="Email" placeholder="Email" >
                <small>Error Message</small>
            </div>

            <div class="form-control">
                <input type="password" name="password" class="cg-register__password" data-input="Mot de Passe" placeholder="Mot de Passe">
                <small>Error Message</small>
            </div>

            <div class="form-control">
                <input type="password" name="password2" class="cg-register__password2" data-input="Mot de Passe de confirmation" placeholder="Confirmation Mot de Passe">
                <small>Error Message</small>
            </div>

            <div class="form-control">
                <input type="hidden" name="action" value="cg_register">
                <button type="submit" class="cg-register__submit">S'enregistrer</button>
                <?php wp_nonce_field( 'ajax-register-nonce', 'cg_auth' ) ?>
            </div>
            <div class="form-success"></div>
        </form>
        <?php
    }
}

new CgRegistration;