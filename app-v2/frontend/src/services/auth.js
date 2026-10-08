import { supabase } from "./supabase.js";

export const auth = {
  async login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async token() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },

  onChange(cb) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      cb(Boolean(session));
    });
  },
};
