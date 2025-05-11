"use client";

import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useState } from 'react';

export default function AuthenticationForm() {
  const [type, toggle] = useToggle(['login', 'register']);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [terms, setTerms] = useState(false);

  return (
    <Center>
      <Paper radius="md" w="500px" p="xl" withBorder mt="75px">
        <Text size="lg" fw={500}>
          Welcome to VOD, {type} with
        </Text>

        <Divider label="" labelPosition="center" my="lg" />

        <form onSubmit={() => {}}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              type="email"
              label="Email"
              placeholder="hello@world.dev"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              radius="md"
            />

            {type === 'register' && (
              <PasswordInput
                required
                label="Renter Password"
                placeholder="Renter Your password"
                value={password2}
                onChange={(event) => setPassword2(event.currentTarget.value)}
                radius="md"
            />
            )}  

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={terms}
                onChange={(event) => setTerms(event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>

  );

}