import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import InterviewCard from '../components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import {getInterviewsByUserId, getLatestInterviews} from '@/lib/actions/general.action'

const page = async () => {

  const user = await getCurrentUser();

  //fetch user interviews and latest interviews parallelly
  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! })
  ])

  const hasPastInterviews = userInterviews && userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews && latestInterviews?.length > 0;
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI-Powered Practice and Feedback</h2>
          <p className='text-lg'> Practice on real interview questions and get instant feedback</p>
          {/* asChild property is used to make a button component get additional functionality like routing or linking */}
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">
              Start an Interview
            </Link>
          </Button>

        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className='max-sm:hidden'
        />

      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>

        <div className='interviews-section'>
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (

                <InterviewCard {...interview} key={interview.id} />
              ))) : (
              <p>You haven't taken any interviews yet!</p>
            )
          }

        </div>

      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Interviews by other users..</h2>
        <div className='interviews-section'>
           {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (

                <InterviewCard {...interview} key={interview.id} />
              ))) : (
              <p>There are no new interviews available! </p>
            )
          }
          {/* <p>You haven't taken any interviews yet!</p> */}
        </div>

      </section>

    </>
  )
}

export default page