"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContactFormProps {
  onSubmit: (data: { email: string; name?: string }) => void;
  isSubmitting?: boolean;
}

export function ContactForm({
  onSubmit,
  isSubmitting = false,
}: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("E-mail é obrigatório");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um endereço de e-mail válido");
      return;
    }

    setEmailError("");
    onSubmit({
      email: email.trim(),
      name: name.trim() || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suas Informações de Contato</CardTitle>
        <CardDescription>
          Usaremos isto para enviar um e-mail com suas metas daqui a um ano
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Endereço de E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              required
              disabled={isSubmitting}
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Continuar para Pagamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
