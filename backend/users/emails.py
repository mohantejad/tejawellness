from djoser.email import (
    ActivationEmail,
    ConfirmationEmail,
    PasswordResetEmail,
    PasswordChangedConfirmationEmail,
    UsernameChangedConfirmationEmail,
    UsernameResetEmail,
)

class CustomActivationEmail(ActivationEmail):
    template_name = "activation.html"

class CustomConfirmationEmail(ConfirmationEmail):
    template_name = "confirmation.html"

class CustomPasswordResetEmail(PasswordResetEmail):
    template_name = "password_reset.html"

class CustomPasswordChangedConfirmationEmail(PasswordChangedConfirmationEmail):
    template_name = "password_changed.html"

class CustomUsernameChangedConfirmationEmail(UsernameChangedConfirmationEmail):
    template_name = "username_changed.html"

class CustomUsernameResetEmail(UsernameResetEmail):
    template_name = "username_reset.html"