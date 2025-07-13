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
**🎯 NOUVEAU LEAD QUALIFIÉ - SITE WEB**

**📊 SCORE LEAD: ${formData.leadScore || 0}/100 - ${getLeadQualityText(formData.leadScore || 0)}**

**👤 INFORMATIONS CONTACT:**
- **Nom:** ${formData.name}
- **Email:** ${formData.email}
- **Entreprise:** ${formData.company || 'Non fourni'}
- **Poste:** ${formData.jobTitle || 'Non fourni'}
- **Téléphone:** ${formData.phone || 'Non fourni'}

**🌍 LOCALISATION:**
- **Région:** ${formData.region === 'dubai' ? 'Dubai, UAE' : 'Abidjan, Côte d\'Ivoire'}
- **Langue préférée:** ${formData.language === 'en' ? 'Anglais' : 'Français'}

**💼 BESOINS BUSINESS:**
- **Objectif principal:** ${getObjectiveText(formData.objective)}
${formData.customObjective ? `- **Objectif personnalisé:** ${formData.customObjective}` : ''}
- **Taille entreprise:** ${getCompanySizeText(formData.companySize)}
- **Budget mensuel:** ${getBudgetText(formData.budget)}
${formData.decisionMaker ? `- **Décideur final:** ${getDecisionMakerText(formData.decisionMaker)}` : ''}

**⏰ URGENCE & TIMING:**
- **Délai souhaité:** ${getTimelineText(formData.timeline)}
${formData.preferredCallTime ? `- **Créneau préféré:** ${getCallTimeText(formData.preferredCallTime)}` : ''}

**💬 MESSAGE:**
${formData.message || 'Aucun message fourni'}

**📈 DONNÉES COMPORTEMENTALES:**
- **Temps sur le site:** ${formData.timeOnSite ? Math.round(formData.timeOnSite/60) + ' minutes' : 'Non mesuré'}
- **Pages visitées:** ${formData.pagesVisited || '1'}
- **Source:** ${formData.referrer || 'Direct'}
- **Appareil:** ${getDeviceInfo(formData.userAgent)}

**📅 PROCHAINES ACTIONS RECOMMANDÉES:**
${getRecommendedActions(formData)}

---
**🕒 Contact soumis:** ${new Date().toLocaleString('fr-FR')}  
**🌐 Source:** Site Web Axle IA - Formulaire Get Started Enhanced  
**🔄 Statut:** ${formData.leadScore >= 60 ? 'Lead Qualifié' : 'Nouveau Contact'}
            `;
        }
        
        // Préparation des données pour ClickUp avec Custom Fields
        const taskData = {
            name: taskName,
            description: description,
            tags: taskTags,
            priority: formData.position ? 2 : 3, // Priorité élevée pour candidatures
            custom_fields: buildCustomFields(formData)
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

// ==============================================
// HELPER FUNCTIONS FOR ENHANCED FORM DATA
// ==============================================

function getObjectiveText(objective) {
    const objectives = {
        'automation': 'Automatisation des processus',
        'chatbot': 'Chatbot client',
        'data-analysis': 'Analyse de données IA',
        'marketing': 'Marketing digital IA',
        'custom': 'Solution personnalisée',
        'other': 'Autre'
    };
    return objectives[objective] || objective || 'Non spécifié';
}

function getCompanySizeText(size) {
    const sizes = {
        'startup': 'Startup (1-10 employés)',
        'sme': 'PME (11-50 employés)',
        'medium': 'Moyenne entreprise (51-200)',
        'large': 'Grande entreprise (200+)'
    };
    return sizes[size] || size || 'Non spécifié';
}

function getBudgetText(budget) {
    const budgets = {
        'under-1k': '< 1,000€',
        '1k-5k': '1,000€ - 5,000€',
        '5k-15k': '5,000€ - 15,000€',
        '15k-50k': '15,000€ - 50,000€',
        'over-50k': '+ 50,000€',
        'discuss': 'À discuter'
    };
    return budgets[budget] || budget || 'Non spécifié';
}

function getDecisionMakerText(decision) {
    const decisions = {
        'yes': 'Oui, décideur final',
        'partial': 'Influence partielle sur la décision',
        'no': 'Doit consulter d\'autres personnes'
    };
    return decisions[decision] || decision || 'Non spécifié';
}

function getTimelineText(timeline) {
    const timelines = {
        'immediate': 'Immédiatement',
        'month': 'Dans le mois',
        'quarter': 'Dans 2-3 mois',
        'semester': 'Dans 6 mois',
        'undefined': 'Pas encore défini'
    };
    return timelines[timeline] || timeline || 'Non spécifié';
}

function getCallTimeText(callTime) {
    const times = {
        'morning': 'Matin (9h-12h)',
        'afternoon': 'Après-midi (14h-17h)',
        'evening': 'Fin de journée (17h-19h)',
        'flexible': 'Flexible'
    };
    return times[callTime] || callTime || 'Non spécifié';
}

function getDeviceInfo(userAgent) {
    if (!userAgent) return 'Non détecté';
    
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablette';
    if (userAgent.includes('Windows')) return 'Windows Desktop';
    if (userAgent.includes('Mac')) return 'Mac Desktop';
    if (userAgent.includes('Linux')) return 'Linux Desktop';
    
    return 'Desktop';
}

function getRecommendedActions(formData) {
    const actions = [];
    const score = formData.leadScore || 0;
    
    if (score >= 80) {
        actions.push('🔥 LEAD CHAUD - Appeler dans les 2h');
        actions.push('📞 Programmer démo personnalisée');
    } else if (score >= 60) {
        actions.push('⚡ LEAD QUALIFIÉ - Appeler dans 24h');
        actions.push('📧 Envoyer présentation entreprise');
    } else if (score >= 40) {
        actions.push('📧 Ajouter à séquence email nurturing');
        actions.push('📅 Programmer rappel dans 1 semaine');
    } else {
        actions.push('📧 Envoyer contenu éducatif');
        actions.push('📅 Programmer rappel dans 2 semaines');
    }
    
    // Actions spécifiques selon l'urgence
    if (formData.timeline === 'immediate') {
        actions.unshift('🚨 URGENCE - Contact prioritaire');
    }
    
    // Actions spécifiques selon le budget
    if (formData.budget === 'over-50k') {
        actions.push('💰 BUDGET ÉLEVÉ - Assigner au directeur commercial');
    }
    
    return actions.map((action, index) => `${index + 1}. ${action}`).join('\n');
}

function getLeadQualityText(score) {
    if (score >= 80) return '🔥 CHAUD';
    if (score >= 60) return '⚡ QUALIFIÉ';
    if (score >= 40) return '📧 TIÈDE';
    return '❄️ FROID';
}

function buildCustomFields(formData) {
    const customFields = [];
    
    // Mapping des IDs des champs selon la région et le type
    const FIELD_IDS = {
        // CONTACTS DUBAI
        contacts_dubai: {
            entreprise: '2349c56e-faf9-4e0e-8450-786139836863',
            poste: '7ce96a11-30f0-484e-9e4d-b907af9d662b', 
            telephone: 'ce9f97b1-192f-4934-a70b-5a37f6be5ca6',
            leadScore: 'eabb6963-1aef-4598-915d-2783d9050914',
            budget: '0ac24987-5d37-4d60-b89e-d6681b0d3708',
            tailleEntreprise: '7e41660a-c578-4aeb-b124-c3a76fb9945f',
            urgence: '6925935a-9aa6-4c85-a314-491fba5d7c03',
            objectif: '215316ba-613b-43e5-91fe-8fa5e2c488ba',
            decideur: 'a2dd4a35-fcdc-4193-9043-13c035f3bb6b',
            sourceTrafic: '4a83844e-aa44-411c-8f83-a3ea68c297dd',
            tempsSite: '324bf52c-7252-45b6-b42b-1e51821c484c',
            pagesVisitees: '8db218c7-eeb8-424d-b84a-4b1e311f9973',
            statutLead: '2b61fc03-942f-4094-b9cc-cb002bae8076',
            region: '6d678019-c949-470a-88f2-e359166dd40c',
            langue: 'a0bd820f-3a57-46dc-989c-0e1ef4a202d9',
            dateSoumission: '0ca2328f-002e-4b02-a7af-3dc31467db0e'
        },
        
        // CONTACTS CI  
        contacts_ci: {
            entreprise: '2349c56e-faf9-4e0e-8450-786139836863',
            poste: '7ce96a11-30f0-484e-9e4d-b907af9d662b',
            telephone: 'ce9f97b1-192f-4934-a70b-5a37f6be5ca6',
            leadScore: 'eabb6963-1aef-4598-915d-2783d9050914',
            budget: '67adff91-7228-414d-b418-efc00749ddf1',
            tailleEntreprise: '82496fdc-e09c-4e96-a706-4114a08c5cc9',
            urgence: '1e7cfa10-7cf0-4382-be24-462d87376dca',
            objectif: 'b94273a3-a886-46e3-9941-1e3148f9cb75',
            decideur: 'c3400238-2d3c-4ee4-904f-b6f4365157c2',
            sourceTrafic: '4a83844e-aa44-411c-8f83-a3ea68c297dd',
            tempsSite: '324bf52c-7252-45b6-b42b-1e51821c484c',
            pagesVisitees: '8db218c7-eeb8-424d-b84a-4b1e311f9973',
            statutLead: 'a96b096b-dabe-4bd6-b922-5a709e103d53',
            region: '63b87e47-56b3-464d-8aa3-dd160840fab0',
            langue: '378f671e-837f-4256-bc51-15725ca8af09',
            dateSoumission: '0ca2328f-002e-4b02-a7af-3dc31467db0e'
        },
        
        // CANDIDATURES DUBAI
        candidats_dubai: {
            telephone: 'ce9f97b1-192f-4934-a70b-5a37f6be5ca6',
            linkedin: '8e4de8fc-add8-413e-9ab6-cbf8a4726437',
            posteCandidature: 'ace65f7e-5db5-47c2-b782-3c202a414eb9',
            region: '46bd9663-ba9d-4e70-8a85-0e70de406134',
            statutCandidature: 'ec42640f-a5bc-4baf-86b9-308afd491649',
            dateCandidature: '59af10ef-abc4-4803-951f-45ce8665965a'
        },
        
        // CANDIDATURES CI
        candidats_ci: {
            telephone: 'ce9f97b1-192f-4934-a70b-5a37f6be5ca6',
            linkedin: '8e4de8fc-add8-413e-9ab6-cbf8a4726437',
            posteCandidature: 'ace65f7e-5db5-47c2-b782-3c202a414eb9',
            region: '7b33eda7-5495-44f7-b632-d937363d806f',
            statutCandidature: 'c59e0508-7369-45dc-85aa-facd38d7bea7',
            dateCandidature: '59af10ef-abc4-4803-951f-45ce8665965a'
        }
    };
    
    // Pour les leads (formulaire Get Started)
    if (!formData.position) {
        const fieldMap = formData.region === 'dubai' ? FIELD_IDS.contacts_dubai : FIELD_IDS.contacts_ci;
        
        // Entreprise
        if (formData.company) {
            customFields.push({
                id: fieldMap.entreprise,
                value: formData.company
            });
        }
        
        // Poste  
        if (formData.jobTitle) {
            customFields.push({
                id: fieldMap.poste,
                value: formData.jobTitle
            });
        }
        
        // Téléphone
        if (formData.phone) {
            customFields.push({
                id: fieldMap.telephone,
                value: formData.phone
            });
        }
        
        // Lead Score
        if (formData.leadScore !== undefined) {
            customFields.push({
                id: fieldMap.leadScore,
                value: formData.leadScore
            });
        }
        
        // Budget
        if (formData.budget) {
            customFields.push({
                id: fieldMap.budget,
                value: getBudgetText(formData.budget)
            });
        }
        
        // Taille entreprise
        if (formData.companySize) {
            customFields.push({
                id: fieldMap.tailleEntreprise,
                value: getCompanySizeText(formData.companySize)
            });
        }
        
        // Urgence
        if (formData.timeline) {
            customFields.push({
                id: fieldMap.urgence,
                value: getTimelineText(formData.timeline)
            });
        }
        
        // Objectif principal
        if (formData.objective) {
            customFields.push({
                id: fieldMap.objectif,
                value: getObjectiveText(formData.objective)
            });
        }
        
        // Décideur final
        if (formData.decisionMaker) {
            customFields.push({
                id: fieldMap.decideur,
                value: getDecisionMakerText(formData.decisionMaker)
            });
        }
        
        // Source de trafic
        if (formData.referrer) {
            customFields.push({
                id: fieldMap.sourceTrafic,
                value: formData.referrer
            });
        }
        
        // Temps sur le site (en minutes)
        if (formData.timeOnSite) {
            customFields.push({
                id: fieldMap.tempsSite,
                value: Math.round(formData.timeOnSite / 60)
            });
        }
        
        // Pages visitées
        if (formData.pagesVisited) {
            customFields.push({
                id: fieldMap.pagesVisitees,
                value: parseInt(formData.pagesVisited)
            });
        }
        
        // Statut du lead basé sur le score
        const leadQuality = getLeadQualityText(formData.leadScore || 0);
        customFields.push({
            id: fieldMap.statutLead,
            value: leadQuality
        });
        
        // Région
        customFields.push({
            id: fieldMap.region,
            value: formData.region === 'dubai' ? 'Dubai' : 'Côte d\'Ivoire'
        });
        
        // Langue
        customFields.push({
            id: fieldMap.langue,
            value: formData.language === 'en' ? 'Anglais' : 'Français'
        });
        
        // Date de soumission
        customFields.push({
            id: fieldMap.dateSoumission,
            value: new Date().toISOString().split('T')[0]
        });
        
    } else {
        // Pour les candidatures
        const fieldMap = formData.region === 'dubai' ? FIELD_IDS.candidats_dubai : FIELD_IDS.candidats_ci;
        
        // Téléphone
        if (formData.phone) {
            customFields.push({
                id: fieldMap.telephone,
                value: formData.phone
            });
        }
        
        // LinkedIn
        if (formData.linkedin) {
            customFields.push({
                id: fieldMap.linkedin,
                value: formData.linkedin
            });
        }
        
        // Poste candidature
        customFields.push({
            id: fieldMap.posteCandidature,
            value: formData.position
        });
        
        // Région candidature
        customFields.push({
            id: fieldMap.region,
            value: formData.region === 'dubai' ? 'Dubai' : 'Côte d\'Ivoire'
        });
        
        // Statut candidature
        customFields.push({
            id: fieldMap.statutCandidature,
            value: 'Nouveau CV'
        });
        
        // Date candidature
        customFields.push({
            id: fieldMap.dateCandidature,
            value: new Date().toISOString().split('T')[0]
        });
    }
    
    console.log('📋 Custom Fields avec IDs:', customFields.length, 'champs configurés');
    return customFields;
}