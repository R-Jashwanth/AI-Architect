
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  User,
  Session,
  AuthError,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error: AuthError | null }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;

  signOut: () => Promise<{ error: AuthError | null }>;

  resetPassword: (
    email: string
  ) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * Create a profile for the authenticated user if it does not exist.
 *
 * IMPORTANT:
 * This function is intentionally kept separate from the authentication
 * loading state. A problem with the profiles table should never prevent
 * the application from finishing authentication initialization.
 */
const createProfileIfNotExists = async (user: User) => {
  if (!supabase) {
    console.warn("Supabase is not configured.");
    return;
  }

  try {
    const profileData = {
      id: user.id,
      email: user.email ?? "",
      username:
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        "",
      avatar_url: null,
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: "id",
      });

    if (error) {
      console.error(
        "Error creating/updating profile:",
        error
      );
    }
  } catch (error) {
    console.error(
      "Unexpected error in createProfileIfNotExists:",
      error
    );
  }
};

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * If Supabase is not configured, don't leave the application
     * stuck on the loading screen.
     */
    if (!supabase) {
      console.warn("Supabase is not configured.");
      setLoading(false);
      return;
    }

    let mounted = true;

    /**
     * Get the current authentication session.
     */
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "Error getting initial session:",
            error
          );

          if (mounted) {
            setSession(null);
            setUser(null);
          }

          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }

        /**
         * Create the user's profile in the background.
         *
         * IMPORTANT:
         * We do NOT await this.
         * Authentication loading should not depend on the
         * profiles database request.
         */
        if (session?.user) {
          void createProfileIfNotExists(session.user);
        }
      } catch (error) {
        console.error(
          "Unexpected error getting initial session:",
          error
        );

        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        /**
         * This MUST always execute so pages such as
         * /collaborate don't remain stuck on "Loading...".
         */
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    /**
     * Listen for authentication changes.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        /**
         * Update authentication state immediately.
         */
        setSession(session);
        setUser(session?.user ?? null);

        /**
         * IMPORTANT:
         * Set loading to false BEFORE doing any profile work.
         *
         * This prevents a slow/hanging profiles query from keeping
         * the entire application on the "Loading..." screen.
         */
        setLoading(false);

        /**
         * Create/update profile in the background.
         */
        if (session?.user) {
          void createProfileIfNotExists(session.user).catch(
            (error) => {
              console.error(
                "Background profile creation failed:",
                error
              );
            }
          );
        }
      }
    );

    /**
     * Cleanup when AuthProvider unmounts.
     */
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign up a new user.
   */
  const signUp = async (
    email: string,
    password: string,
    username: string
  ): Promise<{ error: AuthError | null }> => {
    if (!supabase) {
      return {
        error: {
          message: "Supabase is not configured",
        } as AuthError,
      };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      return { error };
    } catch (error) {
      console.error("Sign up error:", error);

      return {
        error: error as AuthError,
      };
    }
  };

  /**
   * Sign in an existing user.
   */
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | null }> => {
    if (!supabase) {
      return {
        error: {
          message: "Supabase is not configured",
        } as AuthError,
      };
    }

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      return { error };
    } catch (error) {
      console.error("Sign in error:", error);

      return {
        error: error as AuthError,
      };
    }
  };

  /**
   * Sign out the current user.
   */
  const signOut = async (): Promise<{
    error: AuthError | null;
  }> => {
    if (!supabase) {
      return {
        error: {
          message: "Supabase is not configured",
        } as AuthError,
      };
    }

    try {
      const { error } =
        await supabase.auth.signOut();

      return { error };
    } catch (error) {
      console.error("Sign out error:", error);

      return {
        error: error as AuthError,
      };
    }
  };

  /**
   * Send a password reset email.
   */
  const resetPassword = async (
    email: string
  ): Promise<{ error: AuthError | null }> => {
    if (!supabase) {
      return {
        error: {
          message: "Supabase is not configured",
        } as AuthError,
      };
    }

    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo,
          }
        );

      return { error };
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      return {
        error: error as AuthError,
      };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook for accessing authentication state.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}
 