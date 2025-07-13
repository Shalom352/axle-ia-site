// Script pour créer les champs personnalisés dans ClickUp
const API_TOKEN = 'pk_94556145_BWG3ZC5IY0BWJC5B8ZSGPAMHCBBEHMLH';
const API_URL = 'https://api.clickup.com/api/v2';

// IDs des listes où créer les champs
const LISTS = {
    contactsDubai: '901510840930',
    contactsCI: '901510840917',
    candidatsDubai: '901513273174',
    candidatsCI: '901513273175'
};

async function createCustomFields() {
    console.log('🔧 CRÉATION DES CHAMPS PERSONNALISÉS CLICKUP');
    console.log('=' .repeat(60));
    
    try {
        // Champs pour les listes de CONTACTS
        const contactFields = [
            {
                name: 'Email',
                type: 'email_address'
            },
            {
                name: 'Entreprise', 
                type: 'short_text'
            },
            {
                name: 'Poste',
                type: 'short_text'
            },
            {
                name: 'Téléphone',
                type: 'phone'
            },
            {
                name: 'Lead Score',
                type: 'number'
            },
            {
                name: 'Budget',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: '< 1,000€', color: '#ff6b6b' },
                        { name: '1,000€ - 5,000€', color: '#ffa726' },
                        { name: '5,000€ - 15,000€', color: '#ffca28' },
                        { name: '15,000€ - 50,000€', color: '#66bb6a' },
                        { name: '+ 50,000€', color: '#4caf50' },
                        { name: 'À discuter', color: '#9e9e9e' }
                    ]
                }
            },
            {
                name: 'Taille Entreprise',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: 'Startup (1-10 employés)', color: '#81c784' },
                        { name: 'PME (11-50 employés)', color: '#64b5f6' },
                        { name: 'Moyenne entreprise (51-200)', color: '#ffb74d' },
                        { name: 'Grande entreprise (200+)', color: '#f06292' }
                    ]
                }
            },
            {
                name: 'Urgence',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: 'Immédiatement', color: '#f44336' },
                        { name: 'Dans le mois', color: '#ff9800' },
                        { name: 'Dans 2-3 mois', color: '#ffeb3b' },
                        { name: 'Dans 6 mois', color: '#8bc34a' },
                        { name: 'Pas encore défini', color: '#9e9e9e' }
                    ]
                }
            },
            {
                name: 'Objectif Principal',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: 'Automatisation des processus', color: '#2196f3' },
                        { name: 'Chatbot client', color: '#4caf50' },
                        { name: 'Analyse de données IA', color: '#ff9800' },
                        { name: 'Marketing digital IA', color: '#e91e63' },
                        { name: 'Solution personnalisée', color: '#9c27b0' },
                        { name: 'Autre', color: '#607d8b' }
                    ]
                }
            },
            {
                name: 'Décideur Final',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: 'Oui, décideur final', color: '#4caf50' },
                        { name: 'Influence partielle', color: '#ff9800' },
                        { name: 'Doit consulter d\'autres', color: '#f44336' }
                    ]
                }
            },
            {
                name: 'Source Trafic',
                type: 'short_text'
            },
            {
                name: 'Temps sur Site (min)',
                type: 'number'
            },
            {
                name: 'Pages Visitées',
                type: 'number'
            },
            {
                name: 'Statut Lead',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: '🔥 CHAUD', color: '#f44336' },
                        { name: '⚡ QUALIFIÉ', color: '#ff9800' },
                        { name: '📧 TIÈDE', color: '#ffeb3b' },
                        { name: '❄️ FROID', color: '#2196f3' }
                    ]
                }
            },
            {
                name: 'Région',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: 'Dubai', color: '#ff9800' },
                        { name: 'Côte d\'Ivoire', color: '#4caf50' }
                    ]
                }
            },
            {
                name: 'Langue',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: 'Anglais', color: '#2196f3' },
                        { name: 'Français', color: '#4caf50' }
                    ]
                }
            },
            {
                name: 'Date Soumission',
                type: 'date'
            }
        ];
        
        // Champs pour les listes de CANDIDATURES
        const candidateFields = [
            {
                name: 'Email',
                type: 'email_address'
            },
            {
                name: 'Téléphone',
                type: 'phone'
            },
            {
                name: 'LinkedIn',
                type: 'url'
            },
            {
                name: 'Poste Candidature',
                type: 'short_text'
            },
            {
                name: 'Région',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: 'Dubai', color: '#ff9800' },
                        { name: 'Côte d\'Ivoire', color: '#4caf50' }
                    ]
                }
            },
            {
                name: 'Statut Candidature',
                type: 'drop_down',
                type_config: {
                    options: [
                        { name: 'Nouveau CV', color: '#2196f3' },
                        { name: 'CV examiné', color: '#ff9800' },
                        { name: 'Présélectionné', color: '#ffeb3b' },
                        { name: 'Entretien programmé', color: '#4caf50' },
                        { name: 'Entretien réalisé', color: '#9c27b0' },
                        { name: 'Candidat retenu', color: '#4caf50' },
                        { name: 'Candidat refusé', color: '#f44336' }
                    ]
                }
            },
            {
                name: 'Date Candidature',
                type: 'date'
            }
        ];
        
        // Créer les champs pour les listes de contacts
        console.log('\n📋 Création des champs pour les CONTACTS...');
        
        for (const [listName, listId] of Object.entries(LISTS)) {
            if (listName.includes('contacts')) {
                console.log(`\n🎯 Liste: ${listName} (${listId})`);
                
                for (const field of contactFields) {
                    try {
                        const response = await fetch(`${API_URL}/list/${listId}/field`, {
                            method: 'POST',
                            headers: {
                                'Authorization': API_TOKEN,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(field)
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            console.log(`  ✅ ${field.name} créé (ID: ${result.id})`);
                        } else {
                            const error = await response.json();
                            if (error.err && error.err.includes('already exists')) {
                                console.log(`  ⚠️  ${field.name} existe déjà`);
                            } else {
                                console.log(`  ❌ ${field.name} - Erreur: ${error.err || response.status}`);
                            }
                        }
                        
                        // Pause pour éviter le rate limiting
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                    } catch (error) {
                        console.log(`  ❌ ${field.name} - Erreur: ${error.message}`);
                    }
                }
            }
        }
        
        // Créer les champs pour les listes de candidatures
        console.log('\n👨‍💼 Création des champs pour les CANDIDATURES...');
        
        for (const [listName, listId] of Object.entries(LISTS)) {
            if (listName.includes('candidats')) {
                console.log(`\n🎯 Liste: ${listName} (${listId})`);
                
                for (const field of candidateFields) {
                    try {
                        const response = await fetch(`${API_URL}/list/${listId}/field`, {
                            method: 'POST',
                            headers: {
                                'Authorization': API_TOKEN,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(field)
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            console.log(`  ✅ ${field.name} créé (ID: ${result.id})`);
                        } else {
                            const error = await response.json();
                            if (error.err && error.err.includes('already exists')) {
                                console.log(`  ⚠️  ${field.name} existe déjà`);
                            } else {
                                console.log(`  ❌ ${field.name} - Erreur: ${error.err || response.status}`);
                            }
                        }
                        
                        // Pause pour éviter le rate limiting
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                    } catch (error) {
                        console.log(`  ❌ ${field.name} - Erreur: ${error.message}`);
                    }
                }
            }
        }
        
        // Récupérer tous les champs créés avec leurs IDs
        console.log('\n📋 Récupération des IDs des champs...');
        await getCustomFieldIds();
        
        console.log('\n✅ CHAMPS PERSONNALISÉS CRÉÉS AVEC SUCCÈS !');
        console.log('\n📝 Prochaines étapes :');
        console.log('1. Les champs sont maintenant visibles dans vos listes ClickUp');
        console.log('2. Vous pouvez personnaliser les vues pour afficher ces champs');
        console.log('3. Les prochaines soumissions de formulaire rempliront ces champs automatiquement');
        
    } catch (error) {
        console.error('❌ Erreur lors de la création des champs:', error);
    }
}

async function getCustomFieldIds() {
    for (const [listName, listId] of Object.entries(LISTS)) {
        try {
            const response = await fetch(`${API_URL}/list/${listId}/field`, {
                method: 'GET',
                headers: {
                    'Authorization': API_TOKEN
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(`\n📋 Champs dans ${listName}:`);
                result.fields.forEach(field => {
                    console.log(`  - ${field.name} (ID: ${field.id}) - Type: ${field.type}`);
                });
            }
        } catch (error) {
            console.log(`❌ Erreur récupération champs pour ${listName}:`, error.message);
        }
    }
}

// Exécuter la création
createCustomFields();