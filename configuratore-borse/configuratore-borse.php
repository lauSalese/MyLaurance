<?php
/**
 * Plugin Name: Configuratore Borse
 * Description: Configuratore di borse custom. Progetto MyLaurance
 * Version: 1.0.2
 * Author: Laura Rosaria Salese
 * Text Domain: configuratore-borse
 */

// Impedisce l'accesso diretto al file
if (!defined('ABSPATH')) {
    exit;
}

// Definizione costanti del plugin
define('CB_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('CB_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CB_VERSION', '1.0.2');

/**
 * Caricamento script e stili
 */
function cb_enqueue_assets()
{
    // Font Google
    wp_enqueue_style(
        'cb-google-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
        array(),
        null
    );

    // CSS del plugin
    wp_enqueue_style(
        'cb-configuratore-style',
        CB_PLUGIN_URL . 'assets/css/configuratore-style.css',
        array(),
        CB_VERSION
    );

    // JS del plugin
    wp_enqueue_script(
        'cb-configuratore-script',
        CB_PLUGIN_URL . 'assets/js/configuratore.js',
        array('jquery'),
        CB_VERSION,
        true
    );

    // Localizzazione script per AJAX
    wp_localize_script('cb-configuratore-script', 'cbAjax', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('cb_add_to_cart'),
        'pluginUrl' => CB_PLUGIN_URL
    ));
}
add_action('wp_enqueue_scripts', 'cb_enqueue_assets');

/**
 * Opzioni del configuratore
 */
function cb_get_options()
{
    return array(
        'modelli' => array(
            array('id' => 'alba', 'nome' => 'Alba'),
            array('id' => 'aura', 'nome' => 'Aura'),
            array('id' => 'classe', 'nome' => 'Classe'),
            array('id' => 'futura', 'nome' => 'Futura'),
            array('id' => 'onda', 'nome' => 'Onda'),
        ),
        'colori' => array(
            array('id' => 'rosso-vernice', 'nome' => 'Rosso Vernice'),
            array('id' => 'nero-pelle', 'nome' => 'Nero Pelle'),
            array('id' => 'verde-pitone', 'nome' => 'Verde Pitone Smeraldo'),
        ),
        'tracolle' => array(
            array('id' => 'tracolla-abbinata', 'nome' => 'Tracolla Abbinata', 'immagine' => 'tracolle/tracolla-abbinata.png'),
            array('id' => 'catena-oro', 'nome' => 'Catena Oro', 'immagine' => 'tracolle/catena-oro.png'),
            array('id' => 'catena-argento', 'nome' => 'Catena Argento', 'immagine' => 'tracolle/catena-argento.png'),
        ),
        'charm' => array(
            array('id' => 'luna', 'nome' => 'Luna', 'immagine' => 'charm/luna.png'),
            array('id' => 'stella', 'nome' => 'Stella', 'immagine' => 'charm/stella.png'),
            array('id' => 'cuore', 'nome' => 'Cuore', 'immagine' => 'charm/cuore.png'),
        ),
    );
}

/**
 * Shortcode per il configuratore
 */
function cb_configuratore_shortcode($atts)
{
    $atts = shortcode_atts(array(
        'prezzo' => '299',
    ), $atts);

    $options = cb_get_options();

    ob_start();
    ?>
    <div class="cb-configuratore" id="cb-configuratore">
        <!-- Indicatore di Step -->
        <div class="cb-step-indicator">
            <div class="cb-step-item active" data-step="1">
                <div class="cb-step-number">1</div>
                <div class="cb-step-label">Modello</div>
            </div>
            <div class="cb-step-line"></div>
            <div class="cb-step-item" data-step="2">
                <div class="cb-step-number">2</div>
                <div class="cb-step-label">Colore</div>
            </div>
            <div class="cb-step-line"></div>
            <div class="cb-step-item" data-step="3">
                <div class="cb-step-number">3</div>
                <div class="cb-step-label">Tracolla</div>
            </div>
            <div class="cb-step-line"></div>
            <div class="cb-step-item" data-step="4">
                <div class="cb-step-number">4</div>
                <div class="cb-step-label">Charm</div>
            </div>
        </div>

        <!-- Step 1: Scelta Modello -->
        <div class="cb-step cb-step-active" data-step="1">
            <h2 class="cb-step-title">Scegli il tuo Modello</h2>
            <p class="cb-step-subtitle">Ogni borsa racconta una storia unica</p>
            <div class="cb-options-grid">
                <?php foreach ($options['modelli'] as $modello): ?>
                    <div class="cb-option-card" data-type="modello" data-id="<?php echo esc_attr($modello['id']); ?>"
                        data-nome="<?php echo esc_attr($modello['nome']); ?>">
                        <div class="cb-option-image">
                            <img src="<?php echo esc_url(CB_PLUGIN_URL . 'assets/BORSE FOTO/1) Modello/' . $modello['id'] . '.png'); ?>"
                                alt="<?php echo esc_attr($modello['nome']); ?>">
                        </div>
                        <div class="cb-option-name">
                            <?php echo esc_html($modello['nome']); ?>
                        </div>
                        <div class="cb-option-check">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="cb-nav-buttons">
                <button class="cb-btn cb-btn-next" data-next="2" disabled>
                    Continua
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Step 2: Scelta Colore -->
        <div class="cb-step" data-step="2">
            <h2 class="cb-step-title">Scegli il Colore</h2>
            <p class="cb-step-subtitle">Esprimi il tuo stile con la nuance perfetta</p>
            <div class="cb-options-grid" id="cb-colori-grid">
                <?php foreach ($options['colori'] as $colore): ?>
                    <div class="cb-option-card" data-type="colore" data-id="<?php echo esc_attr($colore['id']); ?>"
                        data-nome="<?php echo esc_attr($colore['nome']); ?>">
                        <div class="cb-option-image">
                            <img src="" alt="<?php echo esc_attr($colore['nome']); ?>"
                                data-colore="<?php echo esc_attr($colore['id']); ?>">
                        </div>
                        <div class="cb-option-name">
                            <?php echo esc_html($colore['nome']); ?>
                        </div>
                        <div class="cb-option-check">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="cb-nav-buttons">
                <button class="cb-btn cb-btn-back" data-prev="1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Indietro
                </button>
                <button class="cb-btn cb-btn-next" data-next="3" disabled>
                    Continua
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Step 3: Scelta Tracolla -->
        <div class="cb-step" data-step="3">
            <h2 class="cb-step-title">Scegli la Tracolla</h2>
            <p class="cb-step-subtitle">Il dettaglio che fa la differenza</p>
            <div class="cb-options-grid" id="cb-tracolle-grid">
                <?php foreach ($options['tracolle'] as $tracolla): ?>
                    <div class="cb-option-card" data-type="tracolla" data-id="<?php echo esc_attr($tracolla['id']); ?>"
                        data-nome="<?php echo esc_attr($tracolla['nome']); ?>">
                        <div class="cb-option-image">
                            <img src="" alt="<?php echo esc_attr($tracolla['nome']); ?>"
                                data-tracolla="<?php echo esc_attr($tracolla['id']); ?>">
                        </div>
                        <div class="cb-option-name">
                            <?php echo esc_html($tracolla['nome']); ?>
                        </div>
                        <div class="cb-option-check">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="cb-nav-buttons">
                <button class="cb-btn cb-btn-back" data-prev="2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Indietro
                </button>
                <button class="cb-btn cb-btn-next" data-next="4" disabled>
                    Continua
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Step 4: Scelta Charm -->
        <div class="cb-step" data-step="4">
            <h2 class="cb-step-title">Scegli il Charm</h2>
            <p class="cb-step-subtitle">Un tocco personale per la tua borsa</p>

            <!-- Sotto-step: Selezione metallo (solo per tracolla abbinata) -->
            <div id="cb-metal-selection" style="display: none;">
                <p class="cb-step-subtitle" style="margin-bottom: 20px; font-weight: 600; color: var(--cb-text-primary);">
                    Scegli il tipo di charm</p>
                <div class="cb-options-grid" id="cb-metal-grid">
                    <div class="cb-option-card" data-type="charm-metal" data-id="oro" data-nome="Charm Oro">
                        <div class="cb-option-image">
                            <img src="<?php echo esc_url(CB_PLUGIN_URL . 'assets/BORSE FOTO/4) Charm/charm oro cuore.JPEG'); ?>"
                                alt="Charm Oro">
                        </div>
                        <div class="cb-option-name">Charm Oro</div>
                        <div class="cb-option-check">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="cb-option-card" data-type="charm-metal" data-id="argento" data-nome="Charm Argento">
                        <div class="cb-option-image">
                            <img src="<?php echo esc_url(CB_PLUGIN_URL . 'assets/BORSE FOTO/4) Charm/charm argento cuore.JPEG'); ?>"
                                alt="Charm Argento">
                        </div>
                        <div class="cb-option-name">Charm Argento</div>
                        <div class="cb-option-check">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sotto-step: Selezione forma del charm -->
            <div id="cb-charm-selection" style="display: none;">
                <p class="cb-step-subtitle" id="cb-charm-type-label"
                    style="margin-bottom: 20px; font-weight: 600; color: var(--cb-text-primary);"></p>
                <div class="cb-options-grid" id="cb-charm-grid">
                    <?php foreach ($options['charm'] as $charm): ?>
                        <div class="cb-option-card" data-type="charm" data-id="<?php echo esc_attr($charm['id']); ?>"
                            data-nome="<?php echo esc_attr($charm['nome']); ?>">
                            <div class="cb-option-image">
                                <img src="" alt="<?php echo esc_attr($charm['nome']); ?>"
                                    data-charm="<?php echo esc_attr($charm['id']); ?>">
                            </div>
                            <div class="cb-option-name">
                                <?php echo esc_html($charm['nome']); ?>
                            </div>
                            <div class="cb-option-check">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="cb-nav-buttons">
                <button class="cb-btn cb-btn-back" data-prev="3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Indietro
                </button>
                <button class="cb-btn cb-btn-next cb-btn-summary" data-next="summary" disabled>
                    Vedi Riepilogo
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Riepilogo -->
        <div class="cb-step cb-summary-step" data-step="summary">
            <h2 class="cb-step-title">La Tua Borsa</h2>
            <p class="cb-step-subtitle">Ecco la tua creazione unica</p>

            <div class="cb-summary-container">
                <div class="cb-summary-preview">
                    <div class="cb-summary-image-container">
                        <div class="cb-summary-badge">Personalizzata</div>
                    </div>
                </div>

                <div class="cb-summary-details">
                    <div class="cb-summary-item">
                        <span class="cb-summary-label">Modello</span>
                        <span class="cb-summary-value" id="cb-summary-modello">-</span>
                    </div>
                    <div class="cb-summary-item">
                        <span class="cb-summary-label">Colore</span>
                        <span class="cb-summary-value" id="cb-summary-colore">-</span>
                    </div>
                    <div class="cb-summary-item">
                        <span class="cb-summary-label">Tracolla</span>
                        <span class="cb-summary-value" id="cb-summary-tracolla">-</span>
                    </div>
                    <div class="cb-summary-item">
                        <span class="cb-summary-label">Charm</span>
                        <span class="cb-summary-value" id="cb-summary-charm">-</span>
                    </div>
                    <div class="cb-summary-divider"></div>
                    <div class="cb-summary-price">
                        <span class="cb-price-label">Prezzo</span>
                        <span class="cb-price-original" id="cb-price-original"
                            style="display:none; text-decoration: line-through; color: var(--cb-text-tertiary); font-size: 0.9em; margin-right: 8px;"></span>
                        <span class="cb-price-value" id="cb-price-value">€0,00</span>
                    </div>
                </div>
            </div>

            <div class="cb-nav-buttons">
                <button class="cb-btn cb-btn-back" data-prev="4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Modifica
                </button>
                <button class="cb-btn cb-btn-cart" id="cb-add-to-cart"
                    data-prezzo="<?php echo esc_attr($atts['prezzo']); ?>">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Aggiungi al Carrello
                </button>
            </div>
        </div>

        <!-- Messaggio di Successo -->
        <div class="cb-success-message" id="cb-success-message">
            <div class="cb-success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h3>Aggiunto al Carrello!</h3>
            <p>La tua borsa personalizzata è stata aggiunta con successo.</p>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="cb-btn cb-btn-cart">Vai al Carrello</a>
                <button class="cb-btn cb-btn-restart" id="cb-restart-configurator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                    Configura un'altra borsa
                </button>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('configuratore_borse', 'cb_configuratore_shortcode');

/**
 * Caricamento risorse della landing page
 */
function cb_landing_assets()
{
    wp_enqueue_style(
        'cb-landing-style',
        CB_PLUGIN_URL . 'assets/css/landing-style.css',
        array('cb-google-fonts'),
        CB_VERSION
    );

    wp_enqueue_script(
        'cb-landing-script',
        CB_PLUGIN_URL . 'assets/js/landing.js',
        array(),
        CB_VERSION,
        true
    );
}

/**
 * Shortcode Landing Page: [mylaurance_landing]
 */
function cb_landing_shortcode($atts)
{
    $a = shortcode_atts(array(
        'url' => home_url('/personalizza-yourlaurance/'), // URL configuratore predefinito
    ), $atts);

    // Carica risorse della landing page
    cb_landing_assets();

    $html_file = CB_PLUGIN_PATH . 'landing-page.html';
    if (!file_exists($html_file)) {
        return 'Landing page file not found.';
    }

    $content = file_get_contents($html_file);

    // Estrai il contenuto all'interno dei tag <body>
    if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $content, $matches)) {
        $content = $matches[1];
    }

    // Rimuovi navbar e footer (li fornisce già WordPress)
    $content = preg_replace('/<nav[^>]*>.*?<\/nav>/is', '', $content);
    $content = preg_replace('/<footer[^>]*>.*?<\/footer>/is', '', $content);

    // Sostituisci i percorsi relativi degli asset con l'URL base del plugin
    // Cercando "assets/" per evitare sostituzioni accidentali
    $content = str_replace('href="assets/', 'href="' . CB_PLUGIN_URL . 'assets/', $content);
    $content = str_replace('src="assets/', 'src="' . CB_PLUGIN_URL . 'assets/', $content);

    // Sostituisci i link CTA/Configuratore con l'URL dinamico
    $configurator_url = esc_url($a['url']);
    $content = str_replace('href="configuratore-borse.php"', 'href="' . $configurator_url . '"', $content);
    // Gestione #cta per i link interni o diretti alla pagina
    $content = str_replace('href="#cta"', 'href="' . $configurator_url . '"', $content);

    return '<div class="mylaurance-landing-wrapper">' . $content . '</div>';
}
add_shortcode('mylaurance_landing', 'cb_landing_shortcode');

/**
 * Gestore AJAX per l'aggiunta al carrello
 */
function cb_ajax_add_to_cart()
{
    check_ajax_referer('cb_add_to_cart', 'nonce');

    $modello = sanitize_text_field($_POST['modello'] ?? '');
    $colore = sanitize_text_field($_POST['colore'] ?? '');
    $tracolla = sanitize_text_field($_POST['tracolla'] ?? '');
    $charm = sanitize_text_field($_POST['charm'] ?? '');
    $prezzo = floatval($_POST['prezzo'] ?? 299);

    // Verifica se WooCommerce è attivo
    if (!class_exists('WooCommerce')) {
        wp_send_json_error(array('message' => 'WooCommerce non è attivo'));
        return;
    }

    // Crea il nome del prodotto
    $product_name = sprintf(
        'Borsa %s - %s con %s e Charm %s',
        $modello,
        $colore,
        $tracolla,
        $charm
    );

    // Ottieni o crea il prodotto borsa personalizzata
    $product_id = cb_get_or_create_product();

    if (!$product_id) {
        wp_send_json_error(array('message' => 'Errore nella creazione del prodotto'));
        return;
    }

    // Aggiungi dati personalizzati all'articolo del carrello
    $cart_item_data = array(
        'cb_custom_bag' => true,
        'cb_modello' => $modello,
        'cb_colore' => $colore,
        'cb_tracolla' => $tracolla,
        'cb_charm' => $charm,
        'cb_prezzo' => $prezzo,
        'cb_product_name' => $product_name,
        'cb_image_url' => esc_url_raw($_POST['image_url'] ?? ''),
        'unique_key' => md5(microtime() . rand()),
    );

    // Aggiungi al carrello
    $cart_item_key = WC()->cart->add_to_cart($product_id, 1, 0, array(), $cart_item_data);

    if ($cart_item_key) {
        wp_send_json_success(array(
            'message' => 'Prodotto aggiunto al carrello',
            'cart_url' => wc_get_cart_url()
        ));
    } else {
        wp_send_json_error(array('message' => 'Errore nell\'aggiunta al carrello'));
    }
}
add_action('wp_ajax_cb_add_to_cart', 'cb_ajax_add_to_cart');
add_action('wp_ajax_nopriv_cb_add_to_cart', 'cb_ajax_add_to_cart');

/**
 * Ottieni o crea il prodotto borsa personalizzata
 */
function cb_get_or_create_product()
{
    // Controlla se il prodotto esiste già
    $existing_product = get_page_by_title('Borsa Personalizzata', OBJECT, 'product');

    if ($existing_product) {
        return $existing_product->ID;
    }

    // Crea un nuovo prodotto
    $product = new WC_Product_Simple();
    $product->set_name('Borsa Personalizzata');
    $product->set_status('publish');
    $product->set_catalog_visibility('hidden');
    $product->set_price(299);
    $product->set_regular_price(299);
    $product->set_sold_individually(false);
    $product->set_virtual(true);
    $product->save();

    return $product->get_id();
}

/**
 * Modifica il nome dell'articolo nel carrello per le borse personalizzate
 */
function cb_cart_item_name($name, $cart_item, $cart_item_key)
{
    if (isset($cart_item['cb_custom_bag']) && $cart_item['cb_custom_bag']) {
        return $cart_item['cb_product_name'];
    }
    return $name;
}
add_filter('woocommerce_cart_item_name', 'cb_cart_item_name', 10, 3);

/**
 * Modifica il prezzo dell'articolo nel carrello per le borse personalizzate
 */
function cb_cart_item_price($price, $cart_item, $cart_item_key)
{
    if (isset($cart_item['cb_custom_bag']) && $cart_item['cb_custom_bag']) {
        return wc_price($cart_item['cb_prezzo']);
    }
    return $price;
}
add_filter('woocommerce_cart_item_price', 'cb_cart_item_price', 10, 3);

/**
 * Imposta il prezzo personalizzato nel carrello
 */
function cb_set_cart_item_price($cart)
{
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }

    foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
        if (isset($cart_item['cb_custom_bag']) && $cart_item['cb_custom_bag']) {
            $cart_item['data']->set_price($cart_item['cb_prezzo']);
        }
    }
}
add_action('woocommerce_before_calculate_totals', 'cb_set_cart_item_price', 10, 1);

/**
 * Mostra i dati personalizzati nel carrello
 */
function cb_display_cart_item_data($item_data, $cart_item)
{
    if (isset($cart_item['cb_custom_bag']) && $cart_item['cb_custom_bag']) {
        $item_data[] = array(
            'key' => 'Modello',
            'value' => $cart_item['cb_modello']
        );
        $item_data[] = array(
            'key' => 'Colore',
            'value' => $cart_item['cb_colore']
        );
        $item_data[] = array(
            'key' => 'Tracolla',
            'value' => $cart_item['cb_tracolla']
        );
        $item_data[] = array(
            'key' => 'Charm',
            'value' => $cart_item['cb_charm']
        );
    }
    return $item_data;
}
add_filter('woocommerce_get_item_data', 'cb_display_cart_item_data', 10, 2);

/**
 * Salva i dati personalizzati nell'ordine
 */
function cb_add_order_item_meta($item, $cart_item_key, $values, $order)
{
    if (isset($values['cb_custom_bag']) && $values['cb_custom_bag']) {
        $item->add_meta_data('Modello', $values['cb_modello']);
        $item->add_meta_data('Colore', $values['cb_colore']);
        $item->add_meta_data('Tracolla', $values['cb_tracolla']);
        $item->add_meta_data('Charm', $values['cb_charm']);
    }
}
add_action('woocommerce_checkout_create_order_line_item', 'cb_add_order_item_meta', 10, 4);

/**
 * Mostra la miniatura personalizzata nel carrello per le borse configurate
 */
function cb_cart_item_thumbnail($thumbnail, $cart_item, $cart_item_key)
{
    if (isset($cart_item['cb_custom_bag']) && $cart_item['cb_custom_bag'] && !empty($cart_item['cb_image_url'])) {
        $image_url = esc_url($cart_item['cb_image_url']);
        $thumbnail = '<img src="' . $image_url . '" alt="' . esc_attr($cart_item['cb_product_name'] ?? 'Borsa Personalizzata') . '" style="max-width:100%;height:auto;">';
    }
    return $thumbnail;
}
add_filter('woocommerce_cart_item_thumbnail', 'cb_cart_item_thumbnail', 10, 3);
