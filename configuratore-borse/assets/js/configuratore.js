/**
 * Configuratore Borse - JavaScript
 * Adattato alla struttura cartelle esistente in "BORSE FOTO"
 * Con mappature esatte dei nomi file basate sui file reali
 */

(function ($) {
    'use strict';

    // Memorizza le selezioni (ID)
    const selections = {
        modello: null,
        colore: null,
        tracolla: null,
        charmMetal: null,
        charm: null
    };

    // Nomi delle selezioni per la visualizzazione
    const selectionNames = {
        modello: null,
        colore: null,
        tracolla: null,
        charmMetal: null,
        charm: null
    };

    // Step corrente
    let currentStep = 1;

    // Percorso immagine riepilogo corrente (per il carrello)
    let currentImageUrl = '';

    // Percorso base per le immagini
    const basePath = cbAjax.pluginUrl + 'assets/BORSE FOTO/';

    // Mappatura colori ID -> nome file
    const coloreFileMap = {
        'rosso-vernice': 'rosso',
        'nero-pelle': 'nero',
        'verde-pitone': 'pitone'
    };

    // Casi speciali per Onda che usa "smeraldo" al posto di "pitone"
    // e ha prefisso "2)" nello Step 2
    const ondaColoreMap = {
        'rosso-vernice': 'rosso',
        'nero-pelle': 'nero',
        'verde-pitone': 'smeraldo'
    };

    // Casi speciali Step 3 per "rosso" -> "rossa" in alcuni modelli
    const rossaModels = ['classe', 'futura'];

    /**
     * Inizializza il configuratore
     */
    function init() {
        bindOptionCards();
        bindNavButtons();
        bindAddToCart();
        bindRestart();

        // Impedisci il trascinamento e il salvataggio delle immagini con tasto destro
        $(document).on('dragstart contextmenu', '.cb-configuratore img', function (e) {
            e.preventDefault();
            return false;
        });
    }

    /**
     * Associa eventi click alle card delle opzioni
     */
    function bindOptionCards() {
        $(document).on('click', '.cb-option-card', function () {
            const $card = $(this);
            const type = $card.data('type');
            const id = $card.data('id');
            const nome = $card.data('nome');

            // Gestisci il tipo charm-metal in modo speciale
            if (type === 'charm-metal') {
                $card.siblings('.cb-option-card').removeClass('selected');
                $card.addClass('selected');
                selections.charmMetal = id;
                selectionNames.charmMetal = nome;

                // Dopo aver selezionato il metallo, mostra le forme del charm
                setTimeout(function () {
                    showCharmShapes();
                }, 300);
                return;
            }

            $card.siblings('.cb-option-card').removeClass('selected');
            $card.addClass('selected');

            selections[type] = id;
            selectionNames[type] = nome;

            $card.closest('.cb-step').find('.cb-btn-next').prop('disabled', false);

            $card.css('transform', 'scale(0.95)');
            setTimeout(() => {
                $card.css('transform', '');
            }, 150);
        });
    }

    /**
     * Mostra le opzioni delle forme del charm dopo la selezione del metallo
     * Chiamata anche direttamente quando la catena imposta il metallo automaticamente
     */
    function showCharmShapes() {
        const metal = selections.charmMetal;
        const metalLabel = metal === 'oro' ? 'Oro' : 'Argento';

        // Aggiorna l'etichetta
        $('#cb-charm-type-label').text('Charm ' + metalLabel + ' - Scegli la forma');

        // Aggiorna le immagini dei charm con il metallo corretto
        $('#cb-charm-grid .cb-option-card').each(function () {
            const $card = $(this);
            const charm = $card.data('id');
            // Usa immagini charm generiche: charm {metallo} {charm}.JPEG
            const imagePath = basePath + '4) Charm/charm ' + metal + ' ' + charm + '.JPEG';
            $card.find('.cb-option-image img').attr('src', imagePath);
            $card.removeClass('selected');
        });

        // Resetta la selezione del charm
        selections.charm = null;
        selectionNames.charm = null;
        $('[data-step="4"]').find('.cb-btn-next').prop('disabled', true);

        // Nascondi selezione metallo, mostra forme charm
        $('#cb-metal-selection').hide();
        $('#cb-charm-selection').show();
    }

    /**
     * Associa i pulsanti di navigazione
     */
    function bindNavButtons() {
        $('.cb-btn-next').on('click', function () {
            const nextStep = $(this).data('next');

            if (nextStep === 'summary') {
                showSummary();
            } else {
                if (nextStep === 2 && selections.modello) {
                    updateColorImages();
                } else if (nextStep === 3 && selections.modello && selections.colore) {
                    updateTracollaImages();
                } else if (nextStep === 4 && selections.modello && selections.colore && selections.tracolla) {
                    updateCharmImages();
                }
                goToStep(nextStep);
            }
        });

        $('.cb-btn-back').on('click', function () {
            const prevStep = $(this).data('prev');

            // Se siamo allo Step 4 (charm), le forme charm sono visibili e la tracolla era abbinata
            // torna alla selezione metallo invece dello step 3
            if (currentStep === 4 && selections.tracolla === 'tracolla-abbinata' && $('#cb-charm-selection').is(':visible')) {
                $('#cb-charm-selection').hide();
                $('#cb-metal-selection').show();
                // Resetta la selezione del charm
                selections.charm = null;
                selectionNames.charm = null;
                $('[data-step="4"]').find('.cb-btn-next').prop('disabled', true);
                return;
            }

            goToStep(prevStep);
        });
    }

    /**
     * Ottieni il nome file del colore in base al modello
     */
    function getColoreFileName(modello, colore) {
        if (modello === 'onda') {
            return ondaColoreMap[colore] || coloreFileMap[colore];
        }
        return coloreFileMap[colore];
    }

    /**
     * Ottieni percorso immagine colore - Step 2
     * Pattern trovati:
     * - La maggior parte: {modello} {colore}.JPEG
     * - Onda: 2) onda {colore}.JPEG
     * Nota: Onda verde-pitone usa "pitone" qui, NON "smeraldo"
     */
    function getColorImagePath(modello, colore) {
        const modelloUpper = modello.charAt(0).toUpperCase() + modello.slice(1);
        const coloreName = coloreFileMap[colore]; // Usa sempre la mappa base (pitone, nero, rosso)

        let fileName;
        if (modello === 'onda') {
            fileName = '2) onda ' + coloreName + '.JPEG';
        } else {
            fileName = modello + ' ' + coloreName + '.JPEG';
        }

        return basePath + '2) Colore/2) MODELLO ' + modelloUpper.toUpperCase() + '/' + fileName;
    }

    /**
     * Ottieni percorso immagine tracolla - Step 3
     * Ogni combinazione modello+colore+tracolla ha particolarità nei nomi
     */
    function getTracollaImagePath(modello, colore, tracolla) {
        const modelloUpper = modello.charAt(0).toUpperCase() + modello.slice(1);
        let coloreName = coloreFileMap[colore]; // Usa sempre la mappa colori base (pitone, nero, rosso)

        if (tracolla === 'tracolla-abbinata') {
            // Percorsi TRACOLLA - tutti usano "pitone" (mai "smeraldo")
            // Casi speciali per nome file esatto
            if (modello === 'classe' && colore === 'nero-pelle') {
                // "classe nero con tracolla.png"
                return basePath + '3) Tracolla o Catena/3b) Tracolla/3) Tracolla - Classe/classe nero con tracolla.png';
            }
            if (modello === 'classe' && colore === 'verde-pitone') {
                // "classe pitone tracolla.PNG"
                return basePath + '3) Tracolla o Catena/3b) Tracolla/3) Tracolla - Classe/classe pitone tracolla.PNG';
            }
            if (modello === 'classe' && colore === 'rosso-vernice') {
                // "classe rossa tracolla.JPEG"
                return basePath + '3) Tracolla o Catena/3b) Tracolla/3) Tracolla - Classe/classe rossa tracolla.JPEG';
            }
            // Tutte le altre tracolle: {modello} {coloreName} tracolla.JPEG
            const fileName = modello + ' ' + coloreName + ' tracolla.JPEG';
            return basePath + '3) Tracolla o Catena/3b) Tracolla/3) Tracolla - ' + modelloUpper + '/' + fileName;

        } else {
            // Percorsi CATENA
            const catenaTipo = tracolla === 'catena-oro' ? 'oro' : 'argento';

            // Alba rosso catena - estensione .jpeg minuscola
            if (modello === 'alba' && colore === 'rosso-vernice') {
                const fileName = 'alba rosso catena ' + catenaTipo + '.jpeg';
                return basePath + '3) Tracolla o Catena/3a) Catena/3) Alba - catena/' + fileName;
            }

            // Alba nero catena oro - errore di battitura "albe"
            if (modello === 'alba' && colore === 'nero-pelle' && tracolla === 'catena-oro') {
                return basePath + '3) Tracolla o Catena/3a) Catena/3) Alba - catena/albe nero catena oro.JPEG';
            }

            // Onda smeraldo catena - nome speciale con prefisso
            if (modello === 'onda' && colore === 'verde-pitone') {
                if (catenaTipo === 'argento') {
                    return basePath + '3) Tracolla o Catena/3a) Catena/3) Onda - catena/2b onda smeraldo catena argento.PNG';
                } else {
                    return basePath + '3) Tracolla o Catena/3a) Catena/3) Onda - catena/2b) onda smeraldo catena oro .PNG';
                }
            }

            // Classe rossa catena 
            if (modello === 'classe' && colore === 'rosso-vernice') {
                const fileName = 'classe rossa catena ' + catenaTipo + '.JPEG';
                return basePath + '3) Tracolla o Catena/3a) Catena/3) Classe - catena/' + fileName;
            }

            // Futura rossa catena oro (il file usa "rossa"), ma futura rosso catena argento (usa "rosso")
            if (modello === 'futura' && colore === 'rosso-vernice') {
                if (catenaTipo === 'oro') {
                    return basePath + '3) Tracolla o Catena/3a) Catena/3) Futura - catena/futura rossa catena oro.JPEG';
                } else {
                    return basePath + '3) Tracolla o Catena/3a) Catena/3) Futura - catena/futura rosso catena argento.JPEG';
                }
            }

            // Pattern catena predefinito
            const fileName = modello + ' ' + coloreName + ' catena ' + catenaTipo + '.JPEG';
            return basePath + '3) Tracolla o Catena/3a) Catena/3) ' + modelloUpper + ' - catena/' + fileName;
        }
    }

    /**
     * Ottieni percorso immagine charm - Step 4
     * 
     * Charm su TRACOLLA: 4a) Charm su tracolla/4a) {Modello} {colore}/Tracolla e charm {oro|argento}/
     *   Pattern: {modello} {colore} tracolla {oro|argento} {charm}.JPEG
     *   Speciale: Onda pitone usa nomi diversi
     * 
     * Charm su CATENA: 4b) Charm su catena/4b) {Modello}/{Modello} {colore}/
     *   Pattern: {modello} {colore} catena {oro|argento} {charm}.JPEG
     *   Speciale: Onda smeraldo ha nomi molto inconsistenti
     *   Speciale: Classe/Futura rosso -> "rossa" e a volte manca "catena"
     *   Speciale: Alcuni usano "charm" nel nome, altri no
     */
    function getCharmImagePath(modello, colore, tracolla, charm) {
        const modelloUpper = modello.charAt(0).toUpperCase() + modello.slice(1);
        let coloreName = getColoreFileName(modello, colore);
        // Per i nomi cartelle charm tracolla, Onda usa "pitone" non "smeraldo"
        const coloreFolderName = coloreFileMap[colore];

        if (tracolla === 'tracolla-abbinata') {
            // CHARM SU TRACOLLA
            // Cartella: 4a) Charm su tracolla/4a) {Modello} {colore}/Tracolla e charm {oro|argento}/
            // Usa il metallo del charm scelto dall'utente
            const charmMetal = selections.charmMetal || 'oro';
            const metalUpper = charmMetal.charAt(0).toUpperCase() + charmMetal.slice(1);

            // Determina il nome colore per la cartella (sempre pitone per verde-pitone, rosso per rosso)
            let folderColor = coloreFolderName; // nero, pitone, rosso
            // La cartella è: 4a) {Modello} {folderColor}
            // Speciale: la cartella Classe rosso è "Classe rosso" ma il file usa "rossa"

            // ============================================================
            // PITONE + ORO: ogni file ha nomi unici e inconsistenti
            // ============================================================
            if (colore === 'verde-pitone' && charmMetal === 'oro') {
                const pitoneOroMap = {
                    // Alba pitone oro
                    'alba-cuore': 'alba pitone oro cuore.JPEG',
                    'alba-luna': 'alba tracolla oro luna.JPEG',
                    'alba-stella': 'alba tracolla oro stella.JPEG',
                    // Aura pitone oro
                    'aura-cuore': 'aura pitone oro cuore.JPEG',
                    'aura-luna': 'aura pitone oro luna.JPEG',
                    'aura-stella': 'aura tracolla oro charm stella.JPEG',
                    // Classe pitone oro
                    'classe-cuore': 'classe pitone oro cuore.JPEG',
                    'classe-luna': 'classe tracolla oro luna.JPEG',
                    'classe-stella': 'classe pitone tracolla oro stella.JPEG',
                    // Futura pitone oro
                    'futura-cuore': 'futura pitone oro cuore.JPEG',
                    'futura-luna': 'futura tracolla oro luna.JPEG',
                    'futura-stella': 'futura pitone tracolla oro stella.JPEG'
                };
                const key = modello + '-' + charm;
                const fileName = pitoneOroMap[key];
                if (fileName) {
                    return basePath + '4) Charm/4a) Charm su tracolla/4a) ' + modelloUpper + ' pitone/Tracolla e charm oro/' + fileName;
                }
            }

            // ============================================================
            // ONDA PITONE: nomi completamente diversi con parola chiave "charm"
            // (deve essere PRIMA del blocco generico PITONE + ARGENTO)
            // ============================================================
            if (modello === 'onda' && colore === 'verde-pitone') {
                const specialMap = {
                    'luna-oro': '3a) onda tracolla charm oro luna.JPEG',
                    'cuore-oro': 'onda tracolla charm oro cuore.JPEG',
                    'stella-oro': 'onda tracolla charm oro stella.JPEG',
                    'luna-argento': 'onda tracolla charm argento luna.JPEG',
                    'cuore-argento': 'onda tracolla charm argento cuore.JPEG',
                    'stella-argento': 'onda tracolla charm argento stella.JPEG'
                };
                const key = charm + '-' + charmMetal;
                const fileName = specialMap[key];
                if (fileName) {
                    return basePath + '4) Charm/4a) Charm su tracolla/4a) Onda pitone/Tracolla e charm ' + charmMetal + '/' + fileName;
                }
            }

            // ============================================================
            // PITONE + ARGENTO: pattern consistente {modello} pitone tracolla argento {charm}.JPEG
            // ============================================================
            if (colore === 'verde-pitone' && charmMetal === 'argento') {
                const fileName = modello + ' pitone tracolla argento ' + charm + '.JPEG';
                return basePath + '4) Charm/4a) Charm su tracolla/4a) ' + modelloUpper + ' pitone/Tracolla e charm argento/' + fileName;
            }

            // ============================================================
            // FUTURA NERO ORO LUNA: nome errato "futura tracolla oro luna.JPEG" (manca "nero")
            // ============================================================
            if (modello === 'futura' && colore === 'nero-pelle' && charmMetal === 'oro' && charm === 'luna') {
                return basePath + '4) Charm/4a) Charm su tracolla/4a) Futura nero/Tracolla e charm oro/futura tracolla oro luna.JPEG';
            }

            // ============================================================
            // CLASSE ROSSO: il file usa "rossa"
            // ============================================================
            if (modello === 'classe' && colore === 'rosso-vernice') {
                const fileName = 'classe rossa tracolla ' + charmMetal + ' ' + charm + '.JPEG';
                return basePath + '4) Charm/4a) Charm su tracolla/4a) Classe rosso/Tracolla e charm ' + charmMetal + '/' + fileName;
            }

            // ============================================================
            // PREDEFINITO: {modello} {colore} tracolla {metallo} {charm}.JPEG
            // Funziona per: combinazioni nero/rosso con nomi standard
            // ============================================================
            const fileName = modello + ' ' + coloreName + ' tracolla ' + charmMetal + ' ' + charm + '.JPEG';
            return basePath + '4) Charm/4a) Charm su tracolla/4a) ' + modelloUpper + ' ' + folderColor + '/Tracolla e charm ' + charmMetal + '/' + fileName;

        } else {
            // CHARM SU CATENA
            // Cartella: 4b) Charm su catena/4b) {Modello}/{Modello} {colore}/
            const catenaTipo = tracolla === 'catena-oro' ? 'oro' : 'argento';

            // Determina il nome del colore per le cartelle - prima lettera maiuscola
            let folderColoreName = coloreFolderName;
            if (modello === 'onda' && colore === 'verde-pitone') {
                folderColoreName = 'smeraldo';
            }
            if (rossaModels.includes(modello) && colore === 'rosso-vernice') {
                folderColoreName = 'rosso';
            }
            const coloreFolderUpper = folderColoreName.charAt(0).toUpperCase() + folderColoreName.slice(1);

            // Gestisci Onda smeraldo - nomi completamente unici
            if (modello === 'onda' && colore === 'verde-pitone') {
                const smeraldoMap = {
                    'stella-argento': '3b) onda catena argento charm stella.JPEG',
                    'cuore-argento': '3b) onda catena argentocharm cuore.JPEG',
                    'luna-argento': '3b) onda charm luna argento.PNG',
                    'luna-oro': '3c) onda catena charm oro luna.JPEG',
                    'cuore-oro': '3c) onda catena oro charm cuore.JPEG',
                    'stella-oro': '3c) onda catena oro charm stella.JPEG'
                };
                const key = charm + '-' + catenaTipo;
                const fileName = smeraldoMap[key];
                if (fileName) {
                    return basePath + '4) Charm/4b) Charm su catena/4b) Onda/Onda smeraldo/' + fileName;
                }
            }

            // Gestisci Onda nero - ha un nome file inconsistente
            if (modello === 'onda' && colore === 'nero-pelle' && catenaTipo === 'argento' && charm === 'stella') {
                return basePath + '4) Charm/4b) Charm su catena/4b) Onda/Onda nero/onda nero argento stella.JPEG';
            }

            // Gestisci Classe rossa catena - usa "rossa" senza parola chiave "catena"
            if (modello === 'classe' && colore === 'rosso-vernice') {
                // File: classe rossa {oro|argento} {charm}.JPEG (senza "catena")
                let ext = '.JPEG';
                if (catenaTipo === 'argento' && charm === 'cuore') ext = '.jpg';
                const fileName = 'classe rossa ' + catenaTipo + ' ' + charm + ext;
                return basePath + '4) Charm/4b) Charm su catena/4b) Classe/Classe rosso/' + fileName;
            }

            // Gestisci Classe pitone catena - usa "charm" nel nome, senza "catena"
            if (modello === 'classe' && colore === 'verde-pitone') {
                let ext = '.JPEG';
                if (catenaTipo === 'oro' && charm === 'luna') ext = '.jpg';
                const fileName = 'classe pitone ' + catenaTipo + ' charm ' + charm + ext;
                return basePath + '4) Charm/4b) Charm su catena/4b) Classe/Classe pitone/' + fileName;
            }

            // Gestisci Alba pitone catena - nomi misti con parola chiave "charm"
            if (modello === 'alba' && colore === 'verde-pitone') {
                const albaPitoneMap = {
                    'cuore-argento': 'alba pitone argento charm cuore.JPEG',
                    'stella-argento': 'alba pitone argento charm stella.JPEG',
                    'luna-argento': 'alba pitone catena argento luna.JPEG',
                    'cuore-oro': 'alba pitone oro charm cuore.JPEG',
                    'stella-oro': 'alba pitone oro charm stella.JPEG',
                    'luna-oro': 'alba pitone oro luna.jpg'
                };
                const key = charm + '-' + catenaTipo;
                const fileName = albaPitoneMap[key];
                if (fileName) {
                    return basePath + '4) Charm/4b) Charm su catena/4b) Alba/Alba pitone/' + fileName;
                }
            }

            // Gestisci Futura rosso catena - quasi standard ma con alcune particolarità
            if (modello === 'futura' && colore === 'rosso-vernice') {
                let ext = '.JPEG';
                if (catenaTipo === 'oro' && charm === 'luna') ext = '.jpg';
                // Speciale: "stella" con "oro" si chiama "futura rosso tracolla oro stella.JPEG"
                if (catenaTipo === 'oro' && charm === 'stella') {
                    return basePath + '4) Charm/4b) Charm su catena/4b) Futura/Futura rosso/futura rosso tracolla oro stella.JPEG';
                }
                const fileName = 'futura rosso catena ' + catenaTipo + ' ' + charm + ext;
                return basePath + '4) Charm/4b) Charm su catena/4b) Futura/Futura rosso/' + fileName;
            }

            // Gestisci Onda rosso catena - "stella oro" è nominato come "tracolla"
            if (modello === 'onda' && colore === 'rosso-vernice' && catenaTipo === 'oro' && charm === 'stella') {
                return basePath + '4) Charm/4b) Charm su catena/4b) Onda/Onda rosso/onda rosso tracolla oro stella.JPEG';
            }

            // Gestisci Aura pitone catena - usa "charm" nel nome, senza "catena", oro luna è .jpg
            if (modello === 'aura' && colore === 'verde-pitone') {
                let ext = '.JPEG';
                if (catenaTipo === 'oro' && charm === 'luna') ext = '.jpg';
                const fileName = 'aura pitone ' + catenaTipo + ' charm ' + charm + ext;
                return basePath + '4) Charm/4b) Charm su catena/4b) Aura/Aura pitone/' + fileName;
            }

            // Gestisci Futura pitone catena - usa "charm" nel nome, senza "catena", oro luna è .jpg
            if (modello === 'futura' && colore === 'verde-pitone') {
                let ext = '.JPEG';
                if (catenaTipo === 'oro' && charm === 'luna') ext = '.jpg';
                const fileName = 'futura pitone ' + catenaTipo + ' charm ' + charm + ext;
                return basePath + '4) Charm/4b) Charm su catena/4b) Futura/Futura pitone/' + fileName;
            }

            // Gestisci Futura nero catena - oro luna ha nome errato come "tracolla"
            if (modello === 'futura' && colore === 'nero-pelle' && catenaTipo === 'oro' && charm === 'luna') {
                return basePath + '4) Charm/4b) Charm su catena/4b) Futura/Futura nero/futura nero tracolla oro luna.JPEG';
            }

            // Pattern predefinito: {modello} {colore} catena {oro|argento} {charm}.JPEG
            coloreName = getColoreFileName(modello, colore);
            const fileName = modello + ' ' + coloreName + ' catena ' + catenaTipo + ' ' + charm + '.JPEG';
            return basePath + '4) Charm/4b) Charm su catena/4b) ' + modelloUpper + '/' + modelloUpper + ' ' + folderColoreName + '/' + fileName;
        }
    }

    /**
     * Aggiorna le immagini dello step colore (Step 2)
     */
    function updateColorImages() {
        $('#cb-colori-grid .cb-option-card').each(function () {
            const $card = $(this);
            const colore = $card.data('id');
            const imagePath = getColorImagePath(selections.modello, colore);

            $card.find('.cb-option-image img').attr('src', imagePath);
        });
    }

    /**
     * Aggiorna le immagini dello step tracolla (Step 3)
     */
    function updateTracollaImages() {
        $('#cb-tracolle-grid .cb-option-card').each(function () {
            const $card = $(this);
            const tracolla = $card.data('id');
            const imagePath = getTracollaImagePath(selections.modello, selections.colore, tracolla);

            $card.find('.cb-option-image img').attr('src', imagePath);
        });
    }

    /**
     * Aggiorna lo step charm - mostra il selettore metallo o direttamente le forme charm
     */
    function updateCharmImages() {
        // Resetta le selezioni
        selections.charmMetal = null;
        selectionNames.charmMetal = null;
        selections.charm = null;
        selectionNames.charm = null;
        $('#cb-charm-grid .cb-option-card').removeClass('selected');
        $('#cb-metal-grid .cb-option-card').removeClass('selected');
        $('[data-step="4"]').find('.cb-btn-next').prop('disabled', true);

        if (selections.tracolla === 'tracolla-abbinata') {
            // Mostra prima il selettore metallo
            $('#cb-metal-selection').show();
            $('#cb-charm-selection').hide();
        } else {
            // Imposta automaticamente il metallo in base al tipo di catena
            if (selections.tracolla === 'catena-oro') {
                selections.charmMetal = 'oro';
                selectionNames.charmMetal = 'Charm Oro';
            } else {
                selections.charmMetal = 'argento';
                selectionNames.charmMetal = 'Charm Argento';
            }
            // Salta la selezione metallo, vai direttamente alle forme charm
            $('#cb-metal-selection').hide();
            showCharmShapes();
        }
    }

    /**
     * Naviga a uno step specifico
     */
    function goToStep(step) {
        currentStep = step;
        $('.cb-step').removeClass('cb-step-active');
        $(`.cb-step[data-step="${step}"]`).addClass('cb-step-active');
        updateStepIndicator(step);
    }

    /**
     * Aggiorna l'indicatore di step
     */
    function updateStepIndicator(activeStep) {
        $('.cb-step-item').each(function () {
            const stepNum = $(this).data('step');

            $(this).removeClass('active completed');

            if (stepNum == activeStep) {
                $(this).addClass('active');
            } else if (stepNum < activeStep) {
                $(this).addClass('completed');
            }
        });
    }

    /**
     * Mostra lo step di riepilogo
     */
    function showSummary() {
        $('#cb-summary-modello').text(selectionNames.modello || '-');
        $('#cb-summary-colore').text(selectionNames.colore || '-');
        $('#cb-summary-tracolla').text(selectionNames.tracolla || '-');
        $('#cb-summary-charm').text(selectionNames.charm || '-');

        // === PREZZI DINAMICI ===
        let prezzo = 49.99; // Predefinito: catena (oro o argento)
        let prezzoOriginale = null;

        if (selections.tracolla === 'tracolla-abbinata') {
            prezzo = 59.99;

            // Sconto per nero pelle + tracolla abbinata
            if (selections.colore === 'nero-pelle') {
                prezzoOriginale = 59.99;
                prezzo = 54.99;
            }
        }

        // Formatta il prezzo con la virgola (formato italiano)
        const prezzoFormatted = '€' + prezzo.toFixed(2).replace('.', ',');
        $('#cb-price-value').text(prezzoFormatted);

        // Mostra il prezzo originale barrato se scontato
        if (prezzoOriginale) {
            const originaleFormatted = '€' + prezzoOriginale.toFixed(2).replace('.', ',');
            $('#cb-price-original').text(originaleFormatted).show();
        } else {
            $('#cb-price-original').hide();
        }

        // Aggiorna il pulsante aggiungi al carrello con il prezzo corretto
        $('#cb-add-to-cart').data('prezzo', prezzo);

        // Mostra l'immagine più completa disponibile
        if (selections.modello && selections.colore && selections.tracolla) {
            let imagePath;
            if (selections.charm) {
                imagePath = getCharmImagePath(
                    selections.modello,
                    selections.colore,
                    selections.tracolla,
                    selections.charm
                );
            } else {
                imagePath = getTracollaImagePath(
                    selections.modello,
                    selections.colore,
                    selections.tracolla
                );
            }

            // Salva per il carrello
            currentImageUrl = imagePath;

            const $imageContainer = $('.cb-summary-image-container');

            if ($imageContainer.find('img').length === 0) {
                $imageContainer.append('<img src="' + imagePath + '" alt="La tua borsa">');
            } else {
                $imageContainer.find('img').attr('src', imagePath);
            }
        }

        goToStep('summary');
    }

    /**
     * Associa il pulsante aggiungi al carrello
     */
    function bindAddToCart() {
        $('#cb-add-to-cart').on('click', function () {
            const $btn = $(this);
            const prezzo = $btn.data('prezzo');

            $btn.addClass('loading');
            $btn.prop('disabled', true);

            $.ajax({
                url: cbAjax.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'cb_add_to_cart',
                    nonce: cbAjax.nonce,
                    modello: selectionNames.modello,
                    colore: selectionNames.colore,
                    tracolla: selectionNames.tracolla,
                    charm: selectionNames.charm,
                    prezzo: prezzo,
                    image_url: currentImageUrl
                },
                success: function (response) {
                    if (response.success) {
                        showSuccess();
                    } else {
                        alert(response.data.message || 'Errore durante l\'aggiunta al carrello');
                        $btn.removeClass('loading');
                        $btn.prop('disabled', false);
                    }
                },
                error: function () {
                    alert('Errore di connessione. Riprova.');
                    $btn.removeClass('loading');
                    $btn.prop('disabled', false);
                }
            });
        });
    }

    /**
     * Associa il pulsante ricomincia
     */
    function bindRestart() {
        $(document).on('click', '#cb-restart-configurator', function () {
            // Resetta le selezioni
            selections.modello = null;
            selections.colore = null;
            selections.tracolla = null;
            selections.charmMetal = null;
            selections.charm = null;
            selectionNames.modello = null;
            selectionNames.colore = null;
            selectionNames.tracolla = null;
            selectionNames.charmMetal = null;
            selectionNames.charm = null;

            // Rimuovi lo stato selezionato da tutte le card
            $('.cb-option-card').removeClass('selected');

            // Disabilita tutti i pulsanti avanti
            $('.cb-btn-next').prop('disabled', true);

            // Rimuovi lo stato di successo
            $('.cb-configuratore').removeClass('success');

            // Rimuovi l'immagine del riepilogo
            $('.cb-summary-image-container img').remove();

            // Nascondi i sotto-pannelli charm
            $('#cb-metal-selection').hide();
            $('#cb-charm-selection').hide();

            // Vai allo step 1
            goToStep(1);
        });
    }

    /**
     * Mostra il messaggio di successo
     */
    function showSuccess() {
        $('.cb-configuratore').addClass('success');
        createSuccessParticles();

        // Scrolla in cima al configuratore per mostrare il messaggio di successo
        $('html, body').animate({
            scrollTop: $('.cb-configuratore').offset().top - 50
        }, 500);
    }

    /**
     * Crea l'animazione delle particelle di successo
     */
    function createSuccessParticles() {
        const $container = $('.cb-success-message');
        const colors = ['#B22222', '#DC3545', '#ffffff'];

        for (let i = 0; i < 30; i++) {
            const $particle = $('<div class="cb-particle"></div>');
            const size = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.random() * 100;
            const delay = Math.random() * 0.5;

            $particle.css({
                position: 'absolute',
                width: size + 'px',
                height: size + 'px',
                background: color,
                borderRadius: '50%',
                left: x + '%',
                top: '0',
                opacity: 0,
                pointerEvents: 'none',
                animation: `cb-particle-fall 1.5s ease-out ${delay}s forwards`
            });

            $container.append($particle);

            setTimeout(() => {
                $particle.remove();
            }, 2000 + delay * 1000);
        }
    }

    // Aggiungi i keyframe dell'animazione particelle dinamicamente
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cb-particle-fall {
            0% {
                opacity: 1;
                transform: translateY(-20px) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translateY(200px) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    // Inizializza quando il documento è pronto
    $(document).ready(init);

})(jQuery);
