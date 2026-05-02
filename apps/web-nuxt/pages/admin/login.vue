<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Telescope, Lock, Mail, Chrome } from "lucide-vue-next";
import { Client, Account, OAuthProvider } from "appwrite";

definePageMeta({
  layout: false, // Do not use the admin shell layout for the login page
});

useHead({
  title: "Acesso Administrativo - Astrobiologia",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

const localePath = useLocalePath();

onMounted(async () => {
  try {
    await $fetch("/api/me", { method: "GET" });
    await navigateTo(localePath("/admin/dashboard"));
  } catch {
    // Keep user on login when no active session is available.
  }
});

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = "E-mail e senha são obrigatórios.";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    // Force hard reload to dashboard to ensure Nitro middleware catches the new cookie
    window.location.href = localePath("/admin/dashboard");
  } catch (err: unknown) {
    const statusMessage =
      typeof err === "object" &&
      err !== null &&
      "data" in err &&
      typeof (err as { data?: { statusMessage?: unknown } }).data
        ?.statusMessage === "string"
        ? (err as { data?: { statusMessage?: string } }).data?.statusMessage
        : null;

    errorMessage.value =
      statusMessage || "Login falhou. Verifique suas credenciais.";
  } finally {
    isSubmitting.value = false;
  }
}

function handleGoogleClick() {
  try {
    const config = useRuntimeConfig();
    const origin = window.location.origin;
    const client = new Client()
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProjectId);
    const account = new Account(client);
    account.createOAuth2Token(
      OAuthProvider.Google,
      `${origin}/api/auth/oauth-callback`,
      `${origin}${localePath("/admin/login")}?error=google_failed`,
    );
  } catch (err) {
    errorMessage.value =
      err instanceof Error ? err.message : "Falha ao iniciar login com Google.";
  }
}
</script>

<template>
  <main
    class="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden"
  >
    <!-- Decorative background elements -->
    <div
      class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
    >
      <div
        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"
      ></div>
    </div>

    <div class="w-full max-w-lg relative z-10">
      <div class="flex justify-center mb-10">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <Telescope class="w-8 h-8 text-primary" />
          </div>
          <div class="flex flex-col">
            <span
              class="text-2xl font-black text-white uppercase tracking-tighter leading-none"
              >Astrobiologia</span
            >
            <span
              class="text-[10px] font-black text-accent uppercase tracking-[0.3em] leading-none mt-1"
              >Command Center</span
            >
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/20"
      >
        <div class="p-10 md:p-12">
          <div class="text-center mb-10">
            <h1
              class="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2"
            >
              Autenticação
            </h1>
            <p
              class="text-slate-500 text-sm font-medium uppercase tracking-widest"
            >
              Acesse as ferramentas de editoria
            </p>
          </div>

          <div class="space-y-8">
            <div
              v-if="errorMessage"
              class="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake"
            >
              <div class="w-2 h-2 rounded-full bg-red-600"></div>
              {{ errorMessage }}
            </div>

            <button
              type="button"
              @click="handleGoogleClick"
              class="w-full flex items-center justify-center gap-4 px-6 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm group"
            >
              <Chrome
                class="w-4 h-4 text-primary group-hover:scale-110 transition-transform"
              />
              Continuar com Google
            </button>

            <div class="relative py-2 flex items-center">
              <div class="flex-1 border-t border-slate-100"></div>
              <span
                class="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]"
                >ou e-mail</span
              >
              <div class="flex-1 border-t border-slate-100"></div>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">
              <div class="relative group">
                <Mail
                  class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors"
                />
                <input
                  type="email"
                  v-model="email"
                  placeholder="E-mail Administrativo"
                  required
                  class="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-medium"
                />
              </div>
              <div class="relative group">
                <Lock
                  class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors"
                />
                <input
                  type="password"
                  v-model="password"
                  placeholder="Chave de Acesso"
                  required
                  class="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-medium"
                />
              </div>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full px-6 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all font-black uppercase tracking-widest text-[10px] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? "Autenticando..." : "Entrar no Sistema" }}
              </button>
            </form>
          </div>

          <div class="mt-12 flex flex-col items-center gap-6">
            <div class="flex items-center gap-4">
              <div
                class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
              ></div>
              <span
                class="text-[9px] font-black text-slate-400 uppercase tracking-widest"
                >Servidores Operacionais</span
              >
            </div>
          </div>
        </div>

        <div class="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p
            class="text-slate-400 text-[9px] font-black uppercase tracking-widest"
          >
            Desenvolvido para o Astrobiologia.com.br • © 2026
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
