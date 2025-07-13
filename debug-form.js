// Debug du formulaire en temps réel
const API_TOKEN = 'pk_94556145_BWG3ZC5IY0BWJC5B8ZSGPAMHCBBEHMLH';
const API_URL = 'https://api.clickup.com/api/v2';

async function debugFormSubmission() {
    console.log('🔍 DEBUG - Test soumission formulaire comme sur le site');
    console.log('=' .repeat(60));
    
    // Simuler exactement ce qui se passe quand vous remplissez le formulaire
    const testFormData = {
        name: 'Test User',
        email: 'shalomslam@gmail.com',
        company: 'Test Company',
        message: 'Test message depuis le site web',
        region: 'dubai', // ou 'ci'
        language: 'fr'
    };
    
    console.log('📋 Données du formulaire:');
    console.log(JSON.stringify(testFormData, null, 2));
    
    // Reproduire exactement la logique du site
    let listId, taskName, taskTags, description;
    
    // Logique de routage du site (pas de candidature, donc contact général)
    if (testFormData.region === 'dubai') {
        listId = '901510840930'; // Contacts Dubai
    } else {
        listId = '901510840917'; // Contacts CI
    }
    
    taskName = `🚀 Nouveau Lead: ${testFormData.name} - ${testFormData.company || 'Particulier'}`;
    taskTags = [
        'lead-website', 
        'get-started',
        testFormData.region,
        testFormData.language,
        'nouveau-contact'
    ];
    
    description = `
**🚀 NOUVEAU CONTACT - GET STARTED**

**👤 Informations Contact:**
- **Nom:** ${testFormData.name}
- **Email:** ${testFormData.email}
- **Entreprise:** ${testFormData.company || 'Non spécifiée'}

**🌍 Localisation:**
- **Région:** ${testFormData.region === 'dubai' ? 'Dubai, UAE' : 'Abidjan, Côte d\'Ivoire'}
- **Langue préférée:** ${testFormData.language === 'en' ? 'Anglais' : 'Français'}

**💬 Message du prospect:**
${testFormData.message || 'Aucun message spécifique'}

---
**📅 Contact reçu:** ${new Date().toLocaleString('fr-FR')}  
**🌐 Source:** Site Web Axle IA - Formulaire "Get Started" (DEBUG)
**🎯 Intérêt:** Services IA pour entreprise  
**🔄 Statut:** Nouveau lead - À recontacter
    `;
    
    const taskData = {
        name: taskName,
        description: description,
        tags: taskTags,
        priority: 3
    };
    
    console.log('\n🎯 Configuration de routage:');
    console.log(`   Région: ${testFormData.region}`);
    console.log(`   Liste cible: ${listId}`);
    console.log(`   Nom de la tâche: ${taskName}`);
    
    console.log('\n📤 Envoi vers ClickUp...');
    
    try {
        const response = await fetch(`${API_URL}/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': API_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        console.log(`📡 Statut de la réponse: ${response.status}`);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ SUCCÈS ! Tâche créée:');
            console.log(`   ID de la tâche: ${result.id}`);
            console.log(`   URL: ${result.url}`);
            console.log('\n📍 Allez vérifier dans ClickUp:');
            console.log(`   Virtual Office > CRM > ${testFormData.region === 'dubai' ? 'Contacts Dubai' : 'Contacts CI'}`);
        } else {
            const errorData = await response.json();
            console.log('❌ ERREUR:');
            console.log('   Status:', response.status);
            console.log('   Erreur:', JSON.stringify(errorData, null, 2));
            
            // Diagnostics supplémentaires
            if (response.status === 401) {
                console.log('🔐 Problème d\'authentification - Token invalide?');
            } else if (response.status === 403) {
                console.log('🚫 Problème de permissions - Accès refusé à la liste?');
            } else if (response.status === 404) {
                console.log('📍 Liste introuvable - ID de liste incorrect?');
            }
        }
        
    } catch (error) {
        console.log('❌ ERREUR RÉSEAU:');
        console.log(error);
    }
    
    // Vérifier aussi que la liste existe
    console.log('\n🔍 Vérification de l\'accès à la liste...');
    try {
        const listResponse = await fetch(`${API_URL}/list/${listId}`, {
            headers: {
                'Authorization': API_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        
        if (listResponse.ok) {
            const listData = await listResponse.json();
            console.log('✅ Liste accessible:');
            console.log(`   Nom: "${listData.name}"`);
            console.log(`   ID: ${listData.id}`);
        } else {
            console.log('❌ Impossible d\'accéder à la liste:', listResponse.status);
        }
    } catch (error) {
        console.log('❌ Erreur vérification liste:', error);
    }
}

// Exécuter le debug
debugFormSubmission();