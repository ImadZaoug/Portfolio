# frontend/src/components/ProfileDetail.vue
<template>
  <div class="profile-detail">
    <v-container fluid>
      <v-row>
        <!-- Left Column - Basic Info Mirror -->
        <v-col cols="12" md="3" class="summary-col">
          <div class="summary-card">
            <v-avatar size="120" class="mb-4 summary-avatar">
              <v-img :src="profileStore.profileImage" alt="Profile Picture" />
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">{{ profileStore.name }}</h3>
            <p class="text-subtitle-1 mb-4">{{ profileStore.title }}</p>
            
            <!-- Quick Social Links -->
            <div class="quick-social mb-6">
              <v-btn
                href="https://www.linkedin.com/in/imad-zaoug/"
                target="_blank"
                icon="mdi-linkedin"
                color="#0077B5"
                size="large"
                class="mr-2"
                elevation="2"
              />
              <v-btn
                href="https://github.com/ImadZaoug"
                target="_blank"
                icon="mdi-github"
                color="#24292E"
                size="large"
                elevation="2"
              />
            </div>
            
            <!-- Contact Details -->
            <v-list class="contact-list">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-map-marker" color="primary" />
                </template>
                {{ profileStore.personalInfo.Location }}
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-email" color="primary" />
                </template>
                <span class="email-text">{{ profileStore.personalInfo.Email }}</span>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-briefcase" color="primary" />
                </template>
                {{ profileStore.personalInfo.Experience }}
              </v-list-item>
            </v-list>

            <!-- Specialties -->
            <div class="specialties-section">
              <h4 class="text-h6 mb-3">Specialties</h4>
              <div class="specialty-chips">
                <v-chip
                  v-for="(specialty, index) in profileStore.personalInfo.Specialty.split('|')"
                  :key="index"
                  color="primary"
                  variant="outlined"
                  class="ma-1"
                  size="small"
                >
                  {{ specialty.trim() }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Right Column - Detailed Content -->
        <v-col cols="12" md="9" class="content-col">
          <!-- Languages Section -->
          <section class="detail-section">
            <div class="section-header">
              <v-icon icon="mdi-translate" color="primary" size="32" class="mr-3" />
              <h3 class="text-h5">Languages</h3>
            </div>
            <v-row class="mt-2">
              <v-col 
                v-for="(level, lang) in languages" 
                :key="lang" 
                cols="12" 
                sm="6"
                md="3"
              >
                <v-card class="language-card">
                  <v-card-item>
                    <v-card-title class="language-title">{{ lang }}</v-card-title>
                    <v-card-subtitle class="mt-1">{{ level }}</v-card-subtitle>
                    <v-card-text>
                      <v-progress-linear
                        :model-value="getLanguageProgress(level)"
                        color="primary"
                        height="8"
                        rounded
                        class="mt-2"
                      />
                    </v-card-text>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- Technical Literature Section -->
          <section class="detail-section">
            <div class="section-header">
              <v-icon icon="mdi-book-open-page-variant" color="primary" size="32" class="mr-3" />
              <h3 class="text-h5">Technical Literature</h3>
            </div>
            <v-row class="mt-2">
              <v-col 
                v-for="book in currentBooks" 
                :key="book.title" 
                cols="12" 
                sm="6"
              >
                <v-card class="book-card">
                  <v-card-item>
                    <v-card-title class="book-title">{{ book.title }}</v-card-title>
                    <v-card-subtitle class="mt-1">{{ book.author }}</v-card-subtitle>
                    <v-card-text>
                      <div class="d-flex align-center mt-2">
                        <v-icon 
                          :icon="book.status === 'Completed' ? 'mdi-book-check' : 'mdi-book-open-variant'" 
                          :color="book.status === 'Completed' ? 'success' : 'primary'" 
                          class="mr-2" 
                        />
                        <v-chip
                          :color="book.status === 'Completed' ? 'success' : 'primary'"
                          size="small"
                        >
                          {{ book.status }}
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- Certificates Section -->
          <section class="detail-section">
            <div class="section-header">
              <v-icon icon="mdi-certificate" color="primary" size="32" class="mr-3" />
              <h3 class="text-h5">Certificates</h3>
            </div>
            <v-timeline density="comfortable" side="end" class="mt-4">
              <v-timeline-item
                v-for="cert in certificates"
                :key="cert.title"
                dot-color="primary"
                size="small"
              >
                <v-card class="certificate-card">
                  <v-card-item>
                    <v-card-title class="certificate-title">{{ cert.title }}</v-card-title>
                    <v-card-subtitle class="mt-1">{{ cert.platform }}</v-card-subtitle>
                    <v-card-text>
                      <div class="d-flex align-center mt-2">
                        <v-icon 
                          icon="mdi-check-circle"
                          color="success"
                          class="mr-2" 
                        />
                        <v-chip
                          color="success"
                          size="small"
                          class="completion-date"
                        >
                          Completed
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card-item>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </section>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useProfileStore } from '@/stores/profile'

export default defineComponent({
  name: 'ProfileDetail',
  
  setup() {
    const profileStore = useProfileStore()

    const languages = {
      'Arabic': 'Native',
      'French': 'DALF C1',
      'English': 'TOEIC 855/990',
      'Japanese': 'Beginner (Anime Enthusiast)'
    }

    const currentBooks = [
      {
        title: 'Transformers for Machine Learning',
        author: 'Denis Rothman',
        status: 'Completed'
      },
      {
        title: 'Speech and Language Processing',
        author: 'Dan Jurafsky & James H. Martin',
        status: 'Completed'
      }
    ]

    const certificates = [
      {
        title: 'Natural Language Processing with Classification and Vector Spaces',
        platform: 'Coursera',
        inProgress: false
      },
      {
        title: 'Advanced Computer Vision with TensorFlow',
        platform: 'Coursera',
        inProgress: false
      },
      {
        title: 'Generative AI with Large Language Models',
        platform: 'Coursera',
        inProgress: false
      }
    ]

    const getLanguageProgress = (level) => {
      if (level === 'Native') return 100
      if (level.includes('C1')) return 90
      if (level.includes('TOEIC')) return 85
      return 30
    }

    return {
      profileStore,
      languages,
      currentBooks,
      certificates,
      getLanguageProgress
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-detail {
  height: 100%;
  color: #ffffff;  // Base text color set to white

  .summary-col {
    .summary-card {
      background: var(--v-background-base);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(var(--v-border-color), 0.1);
      color: #ffffff;

      h3 {
        color: #ffffff;
      }

      p {
        color: #ffffff;
      }
    }

    .quick-social {
      .v-btn {
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }
      }
    }

    .contact-list {
      background: transparent;
      
      .v-list-item {
        min-height: 40px;
        margin-bottom: 0.4rem;
        border-radius: 8px;
        background: var(--v-background-base);
        border: 1px solid rgba(var(--v-border-color), 0.1);
        color: #ffffff !important;

        .email-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #ffffff;
        }
      }
    }

    .specialties-section {
      margin-top: 2rem;
      text-align: left;

      h4 {
        color: #ffffff;
      }

      .specialty-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }
  }

  .content-col {
    .detail-section {
      background: var(--v-background-base);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(var(--v-border-color), 0.1);
      color: #ffffff;

      &:last-child {
        margin-bottom: 0;
      }

      .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--v-primary-base);

        h3 {
          margin: 0;
          font-weight: 600;
          color: #ffffff;
        }
      }
    }
  }

  .language-card,
  .book-card,
  .certificate-card {
    height: 100%;
    transition: all 0.3s ease;
    background: var(--v-background-base);
    border: 1px solid rgba(var(--v-border-color), 0.1);
    color: #ffffff;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .v-card-title {
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.3;
      color: #ffffff !important;
    }

    .v-card-subtitle {
      font-size: 0.9rem;
      opacity: 0.8;
      color: rgba(255, 255, 255, 0.9) !important;
    }

    .v-card-text {
      padding-top: 0.5rem;
      color: #ffffff;
    }
  }

  .language-card {
    .language-title {
      font-size: 1.2rem;
      color: #ffffff;
    }
  }

  .book-card {
    .book-title {
      font-size: 1.1rem;
      color: #ffffff;
    }
  }

  .certificate-card {
    .certificate-title {
      font-size: 1rem;
      color: #ffffff;
    }
  }

  .v-timeline {
    .v-timeline-item {
      margin-bottom: 1.5rem;
    }
  }
}

@media (max-width: 960px) {
  .summary-col {
    margin-bottom: 2rem;
  }

  .content-col .detail-section {
    padding: 1.5rem;
  }
}

@media (max-width: 600px) {
  .content-col .detail-section {
    padding: 1rem;
    
    .section-header {
      h3 {
        font-size: 1.2rem;
      }

      .v-icon {
        font-size: 24px !important;
      }
    }
  }
}
</style>