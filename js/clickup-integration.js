// ClickUp Integration - Configuration complète pour Axle IA
const CLICKUP_CONFIG = {
    // ClickUp API token
    apiToken: 'pk_94556145_BWG3ZC5IY0BWJC5B8ZSGPAMHCBBEHMLH',
    
    // Configuration des listes selon le type et la région
    lists: {
        // RECRUTEMENT - Nouvelles listes créées
        candidatsDubai: '901513273174',     // 👥 Candidats Dubai
        candidatsCI: '901513273175',        // 👥 Candidats CI
        
        // CRM - Listes existantes pour les contacts
        contactsDubai: '901510840930',      // 📞 Contacts Dubai
        contactsCI: '901510840917',         // 📞 Contacts CI
        leadsWebflow: '901512846616'        // Leads Webflow
    },
    
    apiUrl: 'https://api.clickup.com/api/v2'
};

window.submitToClickUp = async function(formData) {
    try {
        // Affichage du statut de chargement
        const submitButton = document.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        
        submitButton.textContent = currentLang === 'en' ? 'Sending...' : 'Envoi...';
        submitButton.disabled = true;
        
        // Déterminer la liste de destination et les données selon le type de formulaire
        let listId, taskName, taskTags, description;
        
        if (formData.position) {
            // === CANDIDATURE EMPLOI ===
            // Routage selon la région
            if (formData.region === 'dubai') {
                listId = CLICKUP_CONFIG.lists.candidatsDubai;
            } else {
                listId = CLICKUP_CONFIG.lists.candidatsCI;
            }
            
            taskName = `🎯 Candidature: ${formData.position} - ${formData.name}`;
            taskTags = [
                'candidature', 
                formData.position.toLowerCase().replace(/\s+/g, '-'),
                formData.region,
                formData.language,
                'site-web'
            ];
            
            description = `
**💼 NOUVELLE CANDIDATURE - ${formData.position}**

**👤 Informations Candidat:**
- **Nom:** ${formData.name}
- **Email:** ${formData.email}
- **Téléphone:** ${formData.phone || 'Non fourni'}
- **LinkedIn:** ${formData.linkedin || 'Non fourni'}
- **CV:** ${formData.resume || 'Non fourni'}

**🌍 Localisation:**
- **Région:** ${formData.region === 'dubai' ? 'Dubai, UAE' : 'Abidjan, Côte d\'Ivoire'}
- **Langue préférée:** ${formData.language === 'en' ? 'Anglais' : 'Français'}

**💬 Lettre de Motivation:**
${formData.coverLetter || 'Aucune lettre de motivation fournie'}

---
**📅 Candidature soumise:** ${new Date().toLocaleString('fr-FR')}  
**🌐 Source:** Site Web Axle IA - Section Carrières  
**📋 Poste:** ${formData.position}  
**🔄 Statut:** Nouveau - À examiner

**🎯 Prochaines étapes:**
1. ✅ Réception candidature  
2. 📋 Examen du profil  
3. 📞 Pré-entretien téléphonique  
4. 🤝 Entretien en personne/vidéo  
5. ✅ Décision finale
            `;
        } else {
            // === CONTACT GÉNÉRAL (Get Started) ===
            // Routage selon la région vers les listes CRM
            if (formData.region === 'dubai') {
                listId = CLICKUP_CONFIG.lists.contactsDubai;
            } else {
                listId = CLICKUP_CONFIG.lists.contactsCI;
            }
            
            taskName = `🚀 Nouveau Lead: ${formData.name} - ${formData.company || 'Particulier'}`;
            taskTags = [
                'lead-website', 
                'get-started',
                formData.region,
                formData.language,
                'nouveau-contact'
            ];
            
            description = `
**🚀 NOUVEAU CONTACT - GET STARTED**

**👤 Informations Contact:**
- **Nom:** ${formData.name}
- **Email:** ${formData.email}
- **Entreprise:** ${formData.company || 'Non spécifiée'}

**🌍 Localisation:**
- **Région:** ${formData.region === 'dubai' ? 'Dubai, UAE' : 'Abidjan, Côte d\'Ivoire'}
- **Langue préférée:** ${formData.language === 'en' ? 'Anglais' : 'Français'}

**💬 Message du prospect:**
${formData.message || 'Aucun message spécifique'}

---
**📅 Contact reçu:** ${new Date().toLocaleString('fr-FR')}  
**🌐 Source:** Site Web Axle IA - Formulaire "Get Started"  
**🎯 Intérêt:** Services IA pour entreprise  
**🔄 Statut:** Nouveau lead - À recontacter

**🎯 Prochaines étapes:**
1. ✅ Réception du contact  
2. 📞 Appel de qualification (24-48h)  
3. 📋 Présentation des services  
4. 💼 Proposition commerciale  
5. 🤝 Signature contrat
            `;
        }
        
        // Préparation des données pour ClickUp
        const taskData = {
            name: taskName,
            description: description,
            tags: taskTags,
            priority: formData.position ? 2 : 3 // Priorité élevée pour candidatures
        };
        
        console.log('📤 Envoi vers ClickUp:', { 
            listId, 
            taskName,
            region: formData.region,
            type: formData.position ? 'Candidature' : 'Contact'
        });
        
        // Envoi vers l'API ClickUp
        const response = await fetch(`${CLICKUP_CONFIG.apiUrl}/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': CLICKUP_CONFIG.apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Erreur API ClickUp:', errorData);
            throw new Error(`Erreur ClickUp: ${response.status} - ${errorData.err || 'Erreur inconnue'}`);
        }
        
        const result = await response.json();
        console.log('✅ Tâche créée avec succès dans ClickUp:', result);
        
        // Affichage du message de succès
        showSuccessMessage(formData.position ? 'application' : 'contact');
        
        // Réinitialisation du formulaire
        const form = formData.position 
            ? document.getElementById('applicationForm') 
            : document.getElementById('contactForm');
        if (form) form.reset();
        
        // Fermeture du modal après délai
        setTimeout(() => {
            const modal = formData.position 
                ? document.getElementById('applicationModal') 
                : document.getElementById('contactModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, 3000);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi:', error);
        showErrorMessage(error.message);
    } finally {
        // Réinitialisation du bouton
        const submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
};

function showSuccessMessage(type = 'contact') {
    // Trouver le formulaire actif
    const contactForm = document.getElementById('contactForm');
    const applicationForm = document.getElementById('applicationForm');
    const form = (applicationForm && applicationForm.closest('.modal').style.display !== 'none') 
        ? applicationForm 
        : contactForm;
    
    if (!form) return;
    
    // Supprimer les messages existants
    const existingMsg = form.querySelector('.success-message, .error-message');
    if (existingMsg) existingMsg.remove();
    
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.style.cssText = `
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    
    let message;
    if (type === 'application') {
        message = currentLang === 'en' 
            ? '🎉 Thank you for your application! We\'ll review your profile and contact you soon.'
            : '🎉 Merci pour votre candidature ! Nous examinerons votre profil et vous contacterons bientôt.';
    } else {
        message = currentLang === 'en' 
            ? '✅ Thank you! We\'ve received your message and will contact you within 24-48 hours.'
            : '✅ Merci ! Nous avons reçu votre message et vous contacterons sous 24-48h.';
    }
    
    successMsg.innerHTML = `
        <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">${message}</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">
            ${currentLang === 'en' ? 'Your request has been sent to our team.' : 'Votre demande a été transmise à notre équipe.'}
        </div>
    `;
    
    form.appendChild(successMsg);
    
    // Animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

function showErrorMessage(errorDetails = '') {
    // Trouver le formulaire actif
    const contactForm = document.getElementById('contactForm');
    const applicationForm = document.getElementById('applicationForm');
    const form = (applicationForm && applicationForm.closest('.modal').style.display !== 'none') 
        ? applicationForm 
        : contactForm;
    
    if (!form) return;
    
    // Supprimer les messages existants
    const existingMsg = form.querySelector('.error-message, .success-message');
    if (existingMsg) existingMsg.remove();
    
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.style.cssText = `
        background: linear-gradient(135deg, #f44336, #d32f2f);
        color: white;
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    `;
    
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    
    let message = currentLang === 'en' 
        ? '❌ Sorry, there was an error sending your request. Please try again or contact us directly at hello@axle-ia.com.'
        : '❌ Désolé, une erreur s\'est produite lors de l\'envoi. Veuillez réessayer ou nous contacter directement à hello@axle-ia.com.';
    
    // Messages d'erreur spécifiques
    if (errorDetails.includes('401')) {
        message = currentLang === 'en' 
            ? '🔐 Authentication error. Please contact our technical team.'
            : '🔐 Erreur d\'authentification. Veuillez contacter notre équipe technique.';
    } else if (errorDetails.includes('403')) {
        message = currentLang === 'en' 
            ? '🚫 Permission error. Please contact our technical team.'
            : '🚫 Erreur de permissions. Veuillez contacter notre équipe technique.';
    }
    
    errorMsg.innerHTML = `
        <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">${message}</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">
            ${currentLang === 'en' ? 'Email us directly: hello@axle-ia.com' : 'Contactez-nous directement : hello@axle-ia.com'}
        </div>
    `;
    
    form.appendChild(errorMsg);
    
    // Supprimer le message après 8 secondes
    setTimeout(() => {
        if (errorMsg.parentNode) {
            errorMsg.remove();
        }
    }, 8000);
}